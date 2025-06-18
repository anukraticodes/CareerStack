#pragma GCC optimize("Ofast")
#pragma GCC optimize("no-stack-protector")
#pragma GCC optimize("unroll-loops")
#pragma GCC target("sse,sse2,sse3,ssse3,popcnt,abm,mmx,tune=native")
#pragma GCC optimize("fast-math")
#pragma GCC optimize("Ofast")
#pragma GCC optimize("unroll-loops")
#pragma GCC target("avx,avx2,fma")

#include <iostream>
#include <vector>
#include <algorithm>
#include <cassert>
#include <cmath>
// #include <bits/stdc++.h>

using namespace std;
typedef long long ll;
const ll INF = ll(1E18) + 16;

// ll helper(vector<ll>& arr, ll x){
//     ll n=arr.size();
//     long long s = accumulate(arr.begin(), arr.end(), 0LL);
//     int j = 0, ans = 0;

//     for (int i = n - 1; i >= 0; --i) {
//         while (j < n && s - arr[i] - arr[j] >= x) {
//             j++;
//         }
//         ans += (n - j);
//     }

//     for (int i = 0; i < n; i++) {
//         if (s - arr[i] - arr[i] < x) {
//             ans--;
//         }
//     }

//     return ans / 2;
// }

void helper( ll x) {
    cout<<(long long)2*x<<endl;
    
}

void wushangclan() {
    long long x;
    cin>>x;
    helper(x);
}

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int t;
    cin >> t;
    while (t--) {
        wushangclan();
    }
    return 0;
}
