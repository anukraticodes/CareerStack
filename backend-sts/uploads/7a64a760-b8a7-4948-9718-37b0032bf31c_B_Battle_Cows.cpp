#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    int t; cin >> t;
    while (t--) {
        int n, k; cin >> n >> k; k--;
        vector<int> a(n);
        for (int i = 0; i < n; i++) {
            cin >> a[i];
        }
        int x = find_if(a.begin(), a.end(), [&](int v) { return v > a[k]; }) - a.begin();
        vector<int> pos(n); iota(pos.begin(), pos.end(), 0);
        int ans = 0;
        for (int i : {0, x}) {
            if (i == n) {
                continue;
            }
            swap(pos[i], pos[k]);
            vector<int> stt(n);
            for (int j = 1, u = pos[0]; j < n; j++) {
                int v = pos[j];
                u = (a[u] > a[v] ? u : v);
                stt[u]++;
            }
            swap(pos[i], pos[k]);
            ans = max(ans, stt[k]);
        }
        cout << ans << '\n';
    }
}