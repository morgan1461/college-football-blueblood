"""
Unsupervised Learning Analysis for College Football Programs

Methodology:
1. Feature selection: We use derived metrics that capture both historical prestige
   and modern-era performance to enable meaningful clustering.
2. Standardization: All features are z-score standardized (StandardScaler) so that
   no single feature dominates due to scale differences.
3. PCA: We apply Principal Component Analysis for dimensionality reduction and
   visualization. The first 2-3 components typically capture >70% of variance.
4. K-Means Clustering: We use the elbow method and silhouette scores to select
   the optimal number of clusters (k). This groups programs with similar profiles.
5. Cluster Interpretation: Each cluster is profiled by its centroid values to
   assign human-readable labels (e.g., "Historic & Modern Elite").

Justification:
- K-Means is chosen for its interpretability and efficiency on moderate-sized datasets.
- PCA enables 2D visualization while retaining most variance.
- Silhouette analysis validates cluster quality.
- Feature engineering focuses on rates/percentages to normalize for program age.
"""

import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, silhouette_samples
import json
import os


# Features used for clustering - chosen to capture historical prestige,
# sustained excellence, recent performance, and talent production
CLUSTERING_FEATURES = [
    "win_pct",
    "championships_per_100_years",
    "conference_championships",
    "heisman_winners",
    "bowl_win_pct",
    "all_american_rate",
    "draft_picks_per_year",
    "first_round_rate",
    "recent_win_pct",
    "recent_relevance_score",
    "ten_win_seasons",
    "weeks_ranked_ap25",
]


def run_analysis(df: pd.DataFrame, k_range: tuple = (3, 10)) -> dict:
    """
    Run the full unsupervised learning pipeline.

    Args:
        df: DataFrame from build_dataset()
        k_range: range of k values to evaluate for K-Means

    Returns:
        Dictionary with all analysis results.
    """
    X = df[CLUSTERING_FEATURES].copy()
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # --- PCA ---
    pca_full = PCA()
    pca_full.fit(X_scaled)
    explained_variance = pca_full.explained_variance_ratio_.tolist()
    cumulative_variance = np.cumsum(explained_variance).tolist()

    pca_2d = PCA(n_components=2)
    X_pca_2d = pca_2d.fit_transform(X_scaled)

    pca_3d = PCA(n_components=3)
    X_pca_3d = pca_3d.fit_transform(X_scaled)

    # PCA loadings for interpretation
    loadings_2d = pd.DataFrame(
        pca_2d.components_.T,
        columns=["PC1", "PC2"],
        index=CLUSTERING_FEATURES,
    )

    # --- Elbow Method & Silhouette Analysis ---
    k_min, k_max = k_range
    inertias = []
    silhouette_scores = []
    for k in range(k_min, k_max + 1):
        km = KMeans(n_clusters=k, n_init=20, random_state=42)
        labels = km.fit_predict(X_scaled)
        inertias.append(float(km.inertia_))
        silhouette_scores.append(float(silhouette_score(X_scaled, labels)))

    # Select optimal k as the one with highest silhouette score
    optimal_k = k_min + int(np.argmax(silhouette_scores))

    # --- Final Clustering ---
    km_final = KMeans(n_clusters=optimal_k, n_init=30, random_state=42)
    cluster_labels = km_final.fit_predict(X_scaled)
    df = df.copy()
    df["cluster"] = cluster_labels

    sil_samples = silhouette_samples(X_scaled, cluster_labels)
    df["silhouette_score"] = sil_samples

    # --- Cluster Profiles ---
    cluster_profiles = {}
    for c in range(optimal_k):
        mask = df["cluster"] == c
        profile = df.loc[mask, CLUSTERING_FEATURES].mean().to_dict()
        profile["count"] = int(mask.sum())
        profile["schools"] = df.loc[mask, "school"].tolist()
        profile["avg_silhouette"] = float(sil_samples[mask].mean())
        cluster_profiles[int(c)] = profile

    # --- Assign Descriptive Labels ---
    cluster_names = _assign_cluster_labels(cluster_profiles, optimal_k)

    df["cluster_name"] = df["cluster"].map(cluster_names)

    # --- Build Results ---
    results = {
        "optimal_k": optimal_k,
        "k_range": list(range(k_min, k_max + 1)),
        "inertias": inertias,
        "silhouette_scores": silhouette_scores,
        "explained_variance": explained_variance,
        "cumulative_variance": cumulative_variance,
        "pca_2d_variance": float(sum(pca_2d.explained_variance_ratio_)),
        "pca_3d_variance": float(sum(pca_3d.explained_variance_ratio_)),
        "loadings": loadings_2d.to_dict(),
        "cluster_profiles": cluster_profiles,
        "cluster_names": cluster_names,
        "features_used": CLUSTERING_FEATURES,
        "pca_2d": X_pca_2d.tolist(),
        "pca_3d": X_pca_3d.tolist(),
    }

    return results, df


def _assign_cluster_labels(profiles: dict, k: int) -> dict:
    """
    Assign human-readable names to clusters based on their centroids.
    We rank clusters by a composite of historical + recent metrics.
    """
    # Compute a historical score and recent score for each cluster
    scored = []
    for c, p in profiles.items():
        hist_score = (
            p.get("win_pct", 0) +
            p.get("championships_per_100_years", 0) / 5 +
            p.get("all_american_rate", 0) +
            p.get("bowl_win_pct", 0) +
            p.get("weeks_ranked_ap25", 0) / 1000
        )
        recent_score = (
            p.get("recent_win_pct", 0) +
            p.get("recent_relevance_score", 0)
        )
        scored.append((c, hist_score, recent_score))

    # Sort by composite
    scored.sort(key=lambda x: x[1] + x[2], reverse=True)

    labels = {}
    tier_names = [
        "Elite: Historic & Modern Powerhouses",
        "Strong: Consistent Contenders",
        "Solid: Competitive Programs",
        "Moderate: Occasionally Competitive",
        "Developing: Building Programs",
        "Rebuilding: Historic but Struggling",
        "Emerging: Recent Rise",
        "Legacy: Past Glory",
        "Underperforming: Below Average",
    ]

    # Refine labels based on whether historic or recent score dominates
    for rank, (c, hist, recent) in enumerate(scored):
        if rank < len(tier_names):
            base_label = tier_names[rank]
        else:
            base_label = f"Tier {rank + 1}"

        # Override with more specific labels based on score patterns
        if rank < k:
            ratio = recent / (hist + 0.001)
            if hist > np.median([s[1] for s in scored]) and recent > np.median([s[2] for s in scored]):
                if rank == 0:
                    base_label = "Elite: Historic & Modern Powerhouses"
                else:
                    base_label = "Strong: Consistent Contenders"
            elif hist > np.median([s[1] for s in scored]) and recent <= np.median([s[2] for s in scored]):
                base_label = "Legacy: Historic Success, Modern Decline"
            elif hist <= np.median([s[1] for s in scored]) and recent > np.median([s[2] for s in scored]):
                base_label = "Rising: Modern Success, Limited History"
            else:
                base_label = "Developing: Below-Average Overall"

        labels[c] = base_label

    # Ensure unique labels
    seen = {}
    for c in labels:
        if labels[c] in seen:
            seen[labels[c]] += 1
            labels[c] = f"{labels[c]} ({seen[labels[c]]})"
        else:
            seen[labels[c]] = 1

    return labels


def save_results(results: dict, df: pd.DataFrame, output_dir: str = None):
    """Save analysis results to files."""
    if output_dir is None:
        output_dir = os.path.join(os.path.dirname(__file__), "..", "data")
    os.makedirs(output_dir, exist_ok=True)

    # Save clustered dataset
    df.to_csv(os.path.join(output_dir, "cfb_clustered.csv"), index=False)

    # Save analysis results (convert numpy types for JSON serialization)
    results_serializable = _make_serializable(results)
    with open(os.path.join(output_dir, "analysis_results.json"), "w") as f:
        json.dump(results_serializable, f, indent=2)

    print(f"Results saved to {output_dir}")


def _make_serializable(obj):
    """Recursively convert numpy types to Python native types."""
    if isinstance(obj, dict):
        return {k: _make_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [_make_serializable(v) for v in obj]
    elif isinstance(obj, (np.integer,)):
        return int(obj)
    elif isinstance(obj, (np.floating,)):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    return obj


if __name__ == "__main__":
    from build_dataset import build_dataset

    df = build_dataset()
    results, df_clustered = run_analysis(df)
    save_results(results, df_clustered)

    print(f"\nOptimal k: {results['optimal_k']}")
    print(f"PCA 2D variance explained: {results['pca_2d_variance']:.1%}")
    print(f"\nCluster assignments:")
    for name, group in df_clustered.groupby("cluster_name"):
        print(f"\n  {name}:")
        for _, row in group.iterrows():
            print(f"    - {row['school']}")
