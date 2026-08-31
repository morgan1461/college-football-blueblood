"""
College Football Program Clustering - Shiny for Python Web Interface

This app provides an interactive dashboard for exploring the unsupervised
learning results on college football programs.

Tabs:
1. Cluster Overview - Summary of clusters with descriptions
2. PCA Visualization - Interactive 2D scatter of programs in PCA space
3. Elbow & Silhouette - Model selection diagnostics
4. Program Explorer - Searchable table of all programs with cluster assignments
5. Cluster Profiles - Radar/bar charts comparing cluster centroids
6. Methodology - Explanation of the data science approach
"""

import sys
import os

# Add project root to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from shiny import App, Inputs, Outputs, Session, reactive, render, ui
import plotly.express as px
import plotly.graph_objects as go
from shinywidgets import output_widget, render_widget
import pandas as pd
import numpy as np

from data.build_dataset import build_dataset
from analysis.clustering import run_analysis, CLUSTERING_FEATURES


# --- Run Analysis on Startup ---
df_raw = build_dataset()
analysis_results, df_clustered = run_analysis(df_raw)

# Prepare PCA coordinates
pca_2d = np.array(analysis_results["pca_2d"])
df_clustered["PC1"] = pca_2d[:, 0]
df_clustered["PC2"] = pca_2d[:, 1]

pca_3d = np.array(analysis_results["pca_3d"])
df_clustered["PC1_3d"] = pca_3d[:, 0]
df_clustered["PC2_3d"] = pca_3d[:, 1]
df_clustered["PC3_3d"] = pca_3d[:, 2]


# --- UI ---
app_ui = ui.page_navbar(
    ui.nav_panel(
        "Cluster Overview",
        ui.layout_sidebar(
            ui.sidebar(
                ui.h4("Cluster Filter"),
                ui.input_select(
                    "cluster_select",
                    "Select Cluster",
                    choices=["All"] + sorted(df_clustered["cluster_name"].unique().tolist()),
                    selected="All",
                ),
                ui.hr(),
                ui.h5("Re-cluster"),
                ui.input_slider(
                    "custom_k", "Number of Clusters (k)",
                    min=3, max=10,
                    value=analysis_results["optimal_k"],
                ),
                ui.input_action_button("recluster_btn", "Re-run Clustering"),
                ui.hr(),
                ui.h5("Summary"),
                ui.output_ui("cluster_summary_text"),
                width=350,
            ),
            ui.card(
                ui.card_header("Programs by Cluster"),
                output_widget("cluster_bar_chart"),
            ),
            ui.card(
                ui.card_header("Cluster Members"),
                ui.output_data_frame("cluster_members_table"),
            ),
        ),
    ),
    ui.nav_panel(
        "PCA Visualization",
        ui.layout_sidebar(
            ui.sidebar(
                ui.h4("PCA Settings"),
                ui.input_radio_buttons(
                    "pca_dim", "Dimensions", choices=["2D", "3D"], selected="2D"
                ),
                ui.input_checkbox(
                    "show_labels", "Show School Labels", value=True
                ),
                ui.hr(),
                ui.p(
                    f"2D PCA explains {analysis_results['pca_2d_variance']:.1%} of variance"
                ),
                ui.p(
                    f"3D PCA explains {analysis_results['pca_3d_variance']:.1%} of variance"
                ),
                width=300,
            ),
            ui.card(
                ui.card_header("Programs in PCA Space"),
                output_widget("pca_scatter"),
            ),
            ui.card(
                ui.card_header("PCA Loadings (Feature Contributions to PC1 & PC2)"),
                output_widget("pca_loadings_chart"),
            ),
        ),
    ),
    ui.nav_panel(
        "Model Selection",
        ui.layout_columns(
            ui.card(
                ui.card_header("Elbow Method (Inertia vs. k)"),
                output_widget("elbow_chart"),
            ),
            ui.card(
                ui.card_header("Silhouette Scores vs. k"),
                output_widget("silhouette_chart"),
            ),
            col_widths=[6, 6],
        ),
        ui.card(
            ui.card_header("Explained Variance by PCA Components"),
            output_widget("variance_chart"),
        ),
    ),
    ui.nav_panel(
        "Program Explorer",
        ui.layout_sidebar(
            ui.sidebar(
                ui.input_text("search_school", "Search School", placeholder="e.g. Alabama"),
                ui.input_select(
                    "filter_conf",
                    "Conference",
                    choices=["All"] + sorted(df_clustered["conference"].unique().tolist()),
                    selected="All",
                ),
                ui.input_select(
                    "filter_cluster",
                    "Cluster",
                    choices=["All"] + sorted(df_clustered["cluster_name"].unique().tolist()),
                    selected="All",
                ),
                width=300,
            ),
            ui.card(
                ui.card_header("All Programs"),
                ui.output_data_frame("full_table"),
            ),
        ),
    ),
    ui.nav_panel(
        "Cluster Profiles",
        ui.layout_sidebar(
            ui.sidebar(
                ui.input_select(
                    "profile_feature",
                    "Feature to Compare",
                    choices=CLUSTERING_FEATURES,
                    selected="win_pct",
                ),
                width=300,
            ),
            ui.card(
                ui.card_header("Feature Comparison Across Clusters"),
                output_widget("profile_bar"),
            ),
            ui.card(
                ui.card_header("Cluster Centroid Heatmap"),
                output_widget("profile_heatmap"),
            ),
        ),
    ),
    ui.nav_panel(
        "Methodology",
        ui.card(
            ui.card_header("Data Science Methodology"),
            ui.markdown(
                """
### Dataset Construction
The dataset comprises **{n_programs}** college football programs with **{n_features}** features
spanning historical records, achievements, talent production, and recent-era performance.

**Raw Features** include all-time wins/losses, national championships, conference championships,
Heisman Trophy winners, bowl appearances/wins, All-Americans, AP Top 25 weeks ranked,
NFL Draft picks, and recent-era (2010-2024) wins and poll appearances.

**Derived Features** include win percentage, bowl win percentage, wins per year,
championships per 100 years, draft picks per year, recent win percentage, All-American rate,
first-round pick rate, and a recent relevance score.

### Feature Selection for Clustering
We selected **{n_cluster_features}** features that capture:
- **Historical prestige**: win_pct, championships_per_100_years, all_american_rate, weeks_ranked_ap25
- **Sustained excellence**: conference_championships, heisman_winners, bowl_win_pct, ten_win_seasons
- **Talent production**: draft_picks_per_year, first_round_rate
- **Modern performance**: recent_win_pct, recent_relevance_score

### Standardization
All features are z-score standardized using `StandardScaler` to ensure equal weighting.
Without standardization, features with larger magnitudes (e.g., weeks_ranked_ap25 in hundreds)
would dominate distance calculations over features with small ranges (e.g., win_pct from 0-1).

### Dimensionality Reduction (PCA)
Principal Component Analysis reduces the {n_cluster_features}-dimensional feature space
to 2-3 principal components for visualization. The first two components explain
**{pca_var:.1%}** of total variance.

### Clustering (K-Means)
We evaluated K-Means with k ranging from {k_min} to {k_max}:
- **Elbow method**: Plots inertia (within-cluster sum of squares) vs. k to find the "elbow"
- **Silhouette analysis**: Measures how similar each point is to its own cluster vs. other clusters

The optimal k = **{optimal_k}** was selected based on the highest average silhouette score.

### Cluster Labeling
Clusters are automatically labeled based on their centroid profiles:
- Clusters high in both historical and recent metrics → "Elite" or "Strong"
- Clusters high historically but low recently → "Legacy"
- Clusters low historically but high recently → "Rising"
- Clusters low in both → "Developing"

### Limitations
- Data is compiled from public historical records and may contain minor inaccuracies
- K-Means assumes spherical clusters; other methods (DBSCAN, hierarchical) may yield different groupings
- The labeling heuristic is simplified; expert domain knowledge would improve cluster interpretation
""".format(
                    n_programs=len(df_clustered),
                    n_features=len(df_clustered.columns),
                    n_cluster_features=len(CLUSTERING_FEATURES),
                    pca_var=analysis_results["pca_2d_variance"],
                    k_min=analysis_results["k_range"][0],
                    k_max=analysis_results["k_range"][-1],
                    optimal_k=analysis_results["optimal_k"],
                )
            ),
        ),
    ),
    title="College Football Program Clustering",
    id="main_nav",
)


# --- Server ---
def server(input: Inputs, output: Outputs, session: Session):

    # Reactive values for reclustering
    current_df = reactive.value(df_clustered.copy())
    current_results = reactive.value(analysis_results.copy())

    @reactive.effect
    @reactive.event(input.recluster_btn)
    async def recluster():
        from analysis.clustering import run_analysis as _run, CLUSTERING_FEATURES as _feats
        from sklearn.cluster import KMeans
        from sklearn.preprocessing import StandardScaler
        from sklearn.metrics import silhouette_score as _sil

        k = input.custom_k()
        X = df_raw[_feats].copy()
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        km = KMeans(n_clusters=k, n_init=30, random_state=42)
        labels = km.fit_predict(X_scaled)

        new_results, new_df = _run(df_raw, k_range=(3, 10))
        # Override with custom k
        from analysis.clustering import _assign_cluster_labels
        km2 = KMeans(n_clusters=k, n_init=30, random_state=42)
        new_labels = km2.fit_predict(X_scaled)
        new_df_custom = df_raw.copy()
        new_df_custom["cluster"] = new_labels

        # Build profiles
        profiles = {}
        for c in range(k):
            mask = new_df_custom["cluster"] == c
            profile = new_df_custom.loc[mask, _feats].mean().to_dict()
            profile["count"] = int(mask.sum())
            profile["schools"] = new_df_custom.loc[mask, "school"].tolist()
            profiles[int(c)] = profile

        cluster_names = _assign_cluster_labels(profiles, k)
        new_df_custom["cluster_name"] = new_df_custom["cluster"].map(cluster_names)

        pca_2d_vals = np.array(new_results["pca_2d"])
        new_df_custom["PC1"] = pca_2d_vals[:, 0]
        new_df_custom["PC2"] = pca_2d_vals[:, 1]
        pca_3d_vals = np.array(new_results["pca_3d"])
        new_df_custom["PC1_3d"] = pca_3d_vals[:, 0]
        new_df_custom["PC2_3d"] = pca_3d_vals[:, 1]
        new_df_custom["PC3_3d"] = pca_3d_vals[:, 2]

        # Compute derived cols needed by tables
        total_games = new_df_custom["all_time_wins"] + new_df_custom["all_time_losses"] + new_df_custom["all_time_ties"]
        new_df_custom["win_pct"] = new_df_custom["all_time_wins"] / total_games
        new_df_custom["recent_win_pct"] = new_df_custom["wins_2010_2024"] / (15 * 13)

        current_df.set(new_df_custom)
        new_results["optimal_k"] = k
        new_results["cluster_names"] = cluster_names
        current_results.set(new_results)

        # Update cluster select choices
        await session.send_custom_message("update_cluster_choices", "")
        ui.update_select(
            "cluster_select",
            choices=["All"] + sorted(new_df_custom["cluster_name"].unique().tolist()),
            selected="All",
        )

    @reactive.calc
    def active_df():
        return current_df.get()

    @reactive.calc
    def active_results():
        return current_results.get()

    @reactive.calc
    def filtered_cluster_df():
        sel = input.cluster_select()
        data = active_df()
        if sel == "All":
            return data
        return data[data["cluster_name"] == sel]

    @render.ui
    def cluster_summary_text():
        res = active_results()
        k = res["optimal_k"]
        sil = max(res["silhouette_scores"])
        return ui.TagList(
            ui.p(f"Programs analyzed: {len(active_df())}"),
            ui.p(f"Clusters (k): {k}"),
            ui.p(f"Best silhouette score: {sil:.3f}"),
            ui.p(f"Features used: {len(CLUSTERING_FEATURES)}"),
        )

    @render_widget
    def cluster_bar_chart():
        data = active_df()
        counts = data["cluster_name"].value_counts().reset_index()
        counts.columns = ["Cluster", "Count"]
        fig = px.bar(
            counts, x="Count", y="Cluster", orientation="h",
            color="Cluster", title="Number of Programs per Cluster",
        )
        fig.update_layout(showlegend=False, height=400)
        return fig

    @render.data_frame
    def cluster_members_table():
        data = filtered_cluster_df()[
            ["school", "conference", "cluster_name", "win_pct", "national_championships",
             "heisman_winners", "recent_win_pct", "wins_2010_2024"]
        ].copy()
        data.columns = [
            "School", "Conference", "Cluster", "Win %", "Nat'l Champs",
            "Heismans", "Recent Win %", "Wins 2010-24"
        ]
        data["Win %"] = data["Win %"].round(3)
        data["Recent Win %"] = data["Recent Win %"].round(3)
        return render.DataGrid(data, filters=True)

    @render_widget
    def pca_scatter():
        data = active_df()
        if input.pca_dim() == "2D":
            fig = px.scatter(
                data, x="PC1", y="PC2",
                color="cluster_name",
                hover_name="school",
                hover_data=["conference", "win_pct", "national_championships"],
                text="school" if input.show_labels() else None,
                title="Programs in PCA Space (2D)",
                labels={"cluster_name": "Cluster"},
            )
            fig.update_traces(textposition="top center", textfont_size=8)
            fig.update_layout(height=600)
        else:
            fig = px.scatter_3d(
                data, x="PC1_3d", y="PC2_3d", z="PC3_3d",
                color="cluster_name",
                hover_name="school",
                hover_data=["conference", "win_pct", "national_championships"],
                text="school" if input.show_labels() else None,
                title="Programs in PCA Space (3D)",
                labels={"cluster_name": "Cluster"},
            )
            fig.update_layout(height=700)
        return fig

    @render_widget
    def pca_loadings_chart():
        res = active_results()
        loadings = res["loadings"]
        load_df = pd.DataFrame(loadings)
        load_df["feature"] = load_df.index
        fig = px.bar(
            load_df, x="feature", y=["PC1", "PC2"],
            barmode="group",
            title="PCA Loadings: Feature Contributions",
        )
        fig.update_layout(height=400, xaxis_tickangle=-45)
        return fig

    @render_widget
    def elbow_chart():
        res = active_results()
        fig = px.line(
            x=res["k_range"],
            y=res["inertias"],
            markers=True,
            title="Elbow Method",
            labels={"x": "Number of Clusters (k)", "y": "Inertia"},
        )
        fig.add_vline(
            x=res["optimal_k"],
            line_dash="dash", line_color="red",
            annotation_text=f"Optimal k={res['optimal_k']}",
        )
        fig.update_layout(height=400)
        return fig

    @render_widget
    def silhouette_chart():
        res = active_results()
        fig = px.line(
            x=res["k_range"],
            y=res["silhouette_scores"],
            markers=True,
            title="Silhouette Score vs. k",
            labels={"x": "Number of Clusters (k)", "y": "Silhouette Score"},
        )
        fig.add_vline(
            x=res["optimal_k"],
            line_dash="dash", line_color="red",
            annotation_text=f"Optimal k={res['optimal_k']}",
        )
        fig.update_layout(height=400)
        return fig

    @render_widget
    def variance_chart():
        res = active_results()
        n = len(res["explained_variance"])
        fig = go.Figure()
        fig.add_trace(go.Bar(
            x=list(range(1, n + 1)),
            y=res["explained_variance"],
            name="Individual",
        ))
        fig.add_trace(go.Scatter(
            x=list(range(1, n + 1)),
            y=res["cumulative_variance"],
            name="Cumulative",
            mode="lines+markers",
        ))
        fig.update_layout(
            title="PCA Explained Variance",
            xaxis_title="Component",
            yaxis_title="Explained Variance Ratio",
            height=400,
        )
        return fig

    @reactive.calc
    def explorer_df():
        data = active_df().copy()
        search = input.search_school().strip().lower()
        if search:
            data = data[data["school"].str.lower().str.contains(search)]
        if input.filter_conf() != "All":
            data = data[data["conference"] == input.filter_conf()]
        if input.filter_cluster() != "All":
            data = data[data["cluster_name"] == input.filter_cluster()]
        return data

    @render.data_frame
    def full_table():
        data = explorer_df()[
            ["school", "conference", "cluster_name", "first_season",
             "all_time_wins", "all_time_losses", "win_pct",
             "national_championships", "conference_championships",
             "heisman_winners", "bowl_appearances", "bowl_wins",
             "all_americans", "nfl_draft_picks", "first_round_picks",
             "wins_2010_2024", "ten_win_seasons", "recent_win_pct"]
        ].copy()
        data["win_pct"] = data["win_pct"].round(3)
        data["recent_win_pct"] = data["recent_win_pct"].round(3)
        return render.DataGrid(data, filters=True)

    @render_widget
    def profile_bar():
        data = active_df()
        feature = input.profile_feature()
        means = data.groupby("cluster_name")[feature].mean().reset_index()
        means.columns = ["Cluster", feature]
        fig = px.bar(
            means, x="Cluster", y=feature,
            color="Cluster",
            title=f"Average {feature} by Cluster",
        )
        fig.update_layout(height=400, showlegend=False, xaxis_tickangle=-20)
        return fig

    @render_widget
    def profile_heatmap():
        data = active_df()
        profile_data = []
        for c_name in sorted(data["cluster_name"].unique()):
            mask = data["cluster_name"] == c_name
            means = data.loc[mask, CLUSTERING_FEATURES].mean()
            profile_data.append(means.values)

        cluster_names = sorted(data["cluster_name"].unique())
        z = np.array(profile_data)
        # Normalize columns for display
        col_means = z.mean(axis=0)
        col_stds = z.std(axis=0)
        col_stds[col_stds == 0] = 1
        z_norm = (z - col_means) / col_stds

        fig = go.Figure(data=go.Heatmap(
            z=z_norm,
            x=CLUSTERING_FEATURES,
            y=cluster_names,
            colorscale="RdBu",
            zmid=0,
        ))
        fig.update_layout(
            title="Cluster Centroid Heatmap (Z-Scored)",
            height=400,
            xaxis_tickangle=-45,
        )
        return fig


app = App(app_ui, server)
