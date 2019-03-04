# How to run the VS Code extension

Clone the repo and switch to the root directory
```
git clone -b tc-dev-merge-to-9.5.1 https://github.com/billsedison/vscode-gitlens.git
```
then run build and run it.

## Build

```
npm i
npm run build
```

on macOS, you should run

```
./npm-mac.sh i
./npm-mac.sh run build
```

## Run

1) Open the root folder of the repostiory `vscode-gitlens` in Visual Studio Code
2) Press "F5" to run, a new VS Code window will open.
3) Open the git repo folder that you want to test
5) Verify the functionality

You can follow this [video](https://youtu.be/ZRhI_lumzAg) to verify the functionality

## lint
```
npm run lint
```

on macOS, you should run

```
./npm-mac.sh run lint
```
