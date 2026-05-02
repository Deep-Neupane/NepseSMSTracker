const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const axios = require("axios");
const cheerio = require("cheerio");

async function getCurrentPrice(name){
    let browser;
    try{
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        const targetSymbol = name.trim().toUpperCase();
        
        await page.goto("https://nepsealpha.com/traded-stocks",{waitUntil:"networkidle2"});
        await page.waitForSelector('.text-bold',{timeout:10000});

        await page.type('input[type="search"]',targetSymbol);
        await new Promise(resolve => setTimeout(resolve, 500));

        const html = await page.content();
        const $ = cheerio.load(html);
        let ltp = null;

        $('.text-bold.sorting_1').each((i,el)=> {
            const rowSymbol = $(el).first().text().trim();
            if(rowSymbol === targetSymbol){
                const priceText = $(el).parent().find('td').eq(2).text();
                ltp = Number(priceText.replace(/,/g,''));
                return false;
            }
        });
        return ltp;
    }catch(err){
        console.log("error: ",err.message);
    }finally{
        if(browser) await browser.close();
    }
}

module.exports = {getCurrentPrice};