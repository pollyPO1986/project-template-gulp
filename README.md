---
title: 'Project ENV - Gulp'
tags: 'Gulp, Sass, Babel, Pug'
---

# 開發環境 - Gulp

這裡是我自己在自學 Gulp 時，順便把平常寫 Side project 的環境一起建置
以下是我的一些小筆記

## 安裝

需要先安裝 Gulp (此範例是 Gulp v3.9.1)
Node.js version 11.15.0

_yarn global add [gulp]@[3.9.1]_
_yarn install (安裝 package.json 內的套件)_

## 資料夾結構

以下分享我自己寫專案時的資料夾結構，並介紹如何使用

### HTML / Pug

這邊都是使用 Pug 模板語言來撰寫 HTML
擺放位置：
根目錄 - 個單元頁面
include - components & mixins
layout - 頁面共用模板

### Sass / SCSS

主要使用 SCSS 為撰寫 CSS
擺放位置： scss

### Javascript

以 JQuery 為主要開發 Lib
擺放位置： js

### Images

放置專案需要使用的圖片以及 icons
擺放位置： images

### Fonts

放置專案需要使用的字型檔
擺放位置： fonts
