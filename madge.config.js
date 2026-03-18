module.exports = { 
  tsConfig: './tsconfig.json', 
  extensions: ['ts', 'tsx'], 
  exclude: ['node_modules', '.next', 'dist', 'coverage'], 
  detectiveOptions: { 
    ts: {  
      skipAsyncImports: true,  
      skipTypeImports: true  
    }, 
    tsx: {  
      skipAsyncImports: true,  
      skipTypeImports: true  
    } 
  } 
}; 
