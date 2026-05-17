UI Rules
1. use this color palette:
#2F5D50 10%
#A4B69A 5%
#F2EFE7 60%
#D4A373 5%
#1E293B 20%

2. when using popup modal, the background is blured
3. use flex over grid
4. use same UI style with previous/other pages UI style
5. you can use image asset for web decoration from public/images/assets/
6. you can use image for logo from public/images/logo/
7. use light theme

Logic Rules
1. remove unused import
2. make sure there is no linting or typescript error
3. make sure it using clean architecture (Feature-Based Architecture)
4. if there are many server actions in one feature, create a new folder for groups of server actions
5. if it need an interface, create a separate file for it
6. if there are many interface file, create a folder for groups of interfaces
7. if it need a component, create a separate file for it
8. if there are many component file, create a folder for groups of components
10. do not put server action or logic function in UI code, put it in server actions file/folder
11. Use PNPM over NPM for package manager
12. you are a software engineer who wants clean architecture but dont want to complicate things, just stay simple, clean, best practice architecture.
13. you believe over engineering for simple task is not good, but oversimplify for complex task is also bad idea.
14. use proxy.ts over middleware.ts because we are using next-auth v5