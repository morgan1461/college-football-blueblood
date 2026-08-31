# College Football Program Clustering

An unsupervised learning analysis of college football programs, grouping them by historical and modern performance using K-Means clustering with PCA visualization, served through a Python Shiny web interface.

## Project Structure

```
├── data/
│   ├── build_dataset.py      # Comprehensive dataset of ~75 CFB programs
│   └── cfb_programs.csv      # Generated CSV (after running)
├── analysis/
│   └── clustering.py         # K-Means clustering + PCA pipeline
├── app/
│   └── app.py                # Shiny for Python web dashboard
├── requirements.txt
└── README.md
```

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Analysis (Optional - the app runs it automatically)

```bash
cd data && python build_dataset.py
cd ../analysis && python clustering.py
```

### 3. Launch the Web App

```bash
shiny run app/app.py --port 8000
```

Then open http://localhost:8000 in your browser.

## Dataset

The dataset includes **75+ college football programs** with features spanning:

| Category | Features |
|----------|----------|
| **Historical Record** | All-time wins, losses, ties, win percentage, years playing |
| **Championships** | National championships, conference championships |
| **Individual Awards** | Heisman Trophy winners, All-Americans, Consensus All-Americans |
| **Postseason** | Bowl appearances, bowl wins, bowl win percentage |
| **Rankings** | Weeks ranked in AP Top 25 (all-time) |
| **Talent Production** | NFL Draft picks, first-round picks, draft picks per year |
| **Recent Era (2010-2024)** | Wins, AP poll appearances, recent win percentage |
| **Derived Metrics** | Championships per 100 years, recent relevance score, etc. |

## Methodology

### Feature Selection
12 features are selected for clustering, capturing historical prestige, sustained excellence, recent performance, and talent production.

### Standardization
All features are z-score standardized (`StandardScaler`) to prevent scale dominance.

### PCA (Dimensionality Reduction)
Principal Component Analysis reduces the feature space to 2-3 components for visualization.

### K-Means Clustering
- **Elbow method** and **silhouette analysis** determine optimal k
- Clusters are automatically labeled based on centroid profiles:
  - **Elite: Historic & Modern Powerhouses**
  - **Strong: Consistent Contenders**
  - **Legacy: Historic Success, Modern Decline**
  - **Rising: Modern Success, Limited History**
  - **Developing: Below-Average Overall**

## Web Interface (Shiny)

The dashboard includes 6 tabs:

1. **Cluster Overview** — Summary stats and cluster membership
2. **PCA Visualization** — Interactive 2D/3D scatter plots
3. **Model Selection** — Elbow/silhouette diagnostics and PCA variance
4. **Program Explorer** — Searchable/filterable table of all programs
5. **Cluster Profiles** — Feature comparison charts and heatmaps
6. **Methodology** — Full explanation of the data science approach

## Technologies

- **Python 3.10+**, **pandas/numpy**, **scikit-learn**, **Plotly**, **Shiny for Python**