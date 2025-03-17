
Slight change of plan decided to change the structure of TriesNode by adding a set of most frequent word (top 5) at each node ... which means no dfs, each node will have info of the most freq word of that given prefix

Now the question is if the frequency is same of two words how do we break the tie -- need to think of other criteria may be word length or lexographically.

Thought of something may be ---
Instead of breaking ties lexicographically, we should prioritize words that are searched more often