#include <iostream>
#include <vector>
#include <climits>

using namespace std;

// Function to allocate memory using First Fit
void firstFit(vector<int> blockSize, vector<int> processSize) {
    int m = blockSize.size();
    int n = processSize.size();
    vector<int> allocation(n, -1);  // Stores the block allocated to each process
    vector<int> remainingBlockSize = blockSize; // Track block sizes after allocation

    // First Fit allocation
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (remainingBlockSize[j] >= processSize[i]) {
                allocation[i] = j;  // Assign process i to block j
                remainingBlockSize[j] -= processSize[i]; // Reduce available memory
                break;
            }
        }
    }

    // Display allocation results
    cout << "\nFirst Fit Allocation:\n";
    cout << "Process No.\tProcess Size\tBlock No.\n";
    int internalFragmentation = 0;
    for (int i = 0; i < n; i++) {
        cout << i + 1 << "\t\t" << processSize[i] << "\t\t";
        if (allocation[i] != -1) {
            cout << allocation[i] + 1 << "\n";
            internalFragmentation += remainingBlockSize[allocation[i]];
        } else {
            cout << "Not Allocated\n";
        }
    }

    // Calculate external fragmentation
    int externalFragmentation = 0;
    for (int i = 0; i < m; i++) {
        externalFragmentation += remainingBlockSize[i];
    }

    cout << "Total Internal Fragmentation: " << internalFragmentation << endl;
    cout << "Total External Fragmentation: " << externalFragmentation << endl;
}

// Function to allocate memory using Best Fit
void bestFit(vector<int> blockSize, vector<int> processSize) {
    int m = blockSize.size();
    int n = processSize.size();
    vector<int> allocation(n, -1);  // Stores the block allocated to each process
    vector<int> remainingBlockSize = blockSize; // Track block sizes after allocation

    // Best Fit allocation
    for (int i = 0; i < n; i++) {
        int bestIdx = -1;
        for (int j = 0; j < m; j++) {
            if (remainingBlockSize[j] >= processSize[i]) {
                if (bestIdx == -1 || remainingBlockSize[j] < remainingBlockSize[bestIdx]) {
                    bestIdx = j;
                }
            }
        }
        if (bestIdx != -1) {
            allocation[i] = bestIdx;
            remainingBlockSize[bestIdx] -= processSize[i]; // Reduce available memory
        }
    }

    // Display allocation results
    cout << "\nBest Fit Allocation:\n";
    cout << "Process No.\tProcess Size\tBlock No.\n";
    int internalFragmentation = 0;
    for (int i = 0; i < n; i++) {
        cout << i + 1 << "\t\t" << processSize[i] << "\t\t";
        if (allocation[i] != -1) {
            cout << allocation[i] + 1 << "\n";
            internalFragmentation += remainingBlockSize[allocation[i]];
        } else {
            cout << "Not Allocated\n";
        }
    }

    // Calculate external fragmentation
    int externalFragmentation = 0;
    for (int i = 0; i < m; i++) {
        externalFragmentation += remainingBlockSize[i];
    }

    cout << "Total Internal Fragmentation: " << internalFragmentation << endl;
    cout << "Total External Fragmentation: " << externalFragmentation << endl;
}

int main() {
    int m, n;
    cout << "Enter the number of memory blocks: ";
    cin >> m;
    vector<int> blockSize(m);
    cout << "Enter the sizes of memory blocks:\n";
    for (int i = 0; i < m; i++)
        cin >> blockSize[i];

    cout << "Enter the number of processes: ";
    cin >> n;
    vector<int> processSize(n);
    cout << "Enter the sizes of processes:\n";
    for (int i = 0; i < n; i++)
        cin >> processSize[i];

    firstFit(blockSize, processSize);
    bestFit(blockSize, processSize);

    return 0;
}

