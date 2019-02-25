@if "%1" == "" (
  @echo Usage: %0 build
  @echo Usage: %0 bundle
  @echo ...
  @echo Usage: %0 clean
  @echo Usage: %0 lint
  @echo ...  
) else (
  @cd macos-scripts && npm run %1 && cd ..
)
