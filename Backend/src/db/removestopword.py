import pandas as pd

# Load the dataset
df = pd.read_csv('ngram_freq_dict_top_80.csv')

# Ensure 'count' is numeric
df['count'] = pd.to_numeric(df['count'], errors='coerce')
df.dropna(subset=['word', 'count'], inplace=True)

# Calculate 20th percentile cutoff
cutoff = df['count'].quantile(0.20)

# Keep rows with count >= cutoff
filtered_df = df[df['count'] >= cutoff]

print(f"Cutoff frequency at 20th percentile: {cutoff}")
print(f"Original words: {len(df)}, After filtering: {len(filtered_df)}")

# Save the cleaned dataset
filtered_df.to_csv('ngram_freq_dict_top_80.csv', index=False)
