import numpy as np
import standarisasi_data

def pca_using_svd(X, component):
    # Step 1 : Standardize the data
    X_std = standarisasi_data(X)
    
    # Step 2 : Compute the covariance matrix
    N = X_std.shape[0]
    C = (1/N) * np.dot(X_std.T, X_std)
    
    # Step 3 : SVD
    U, S, Vt = np.linalg.svd(C)
    
    # Step 4 : Select First 
    Uk = U[:, :component]
    
    #Step 5 : PCA
    Z = np.dot(X_std, Uk)
    
    return Z, Uk, S