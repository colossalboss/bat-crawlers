const puppeteer = require('puppeteer');
const fs = require("fs");
const { count } = require('console');

const saveToFile = (path, picks) => {
    for (let i = 0; i < picks.length; i++) {
        let data = '';
        if (picks[i].league) {
            data = `${picks[i].league}`;
        }

        if (picks[i].time) {
            data += ` ${picks[i].time}`;
        }

        if (picks[i].date) {
            data += ` ${picks[i].date}`;
        }

        data += ` ${picks[i].fixture} ${picks[i].tip} ${picks[i].odd}`;

        if (picks[i].accuracy) {
            data += ` ${picks[i].accuracy}`;
        }
        data += '\n';
        fs.appendFileSync(path, data);
    }
}

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://betadvice.me/1_5_betting-picks.html', {
        waitUntil: 'load',
        // Remove the timeout
        timeout: 0
    });
    // //   await page.screenshot({path: 'example.png'});

    const picks = await page.evaluate(() => {
        let betAdvicePickCount = document.querySelectorAll('#t5 tbody tr td#n1');
        const picks = []
        for (let i = 1; i <= betAdvicePickCount.length; i++) {
            let pick = {}
            pick.time = document.querySelector(`#t5 tbody tr.row${i} td#n1`).textContent;
            pick.fixture = document.querySelector(`#t5 tbody tr.row${i} td#n2`).textContent;
            pick.tip = document.querySelector(`#t5 tbody tr.row${i} td#n3`).textContent;
            pick.odd = document.querySelector(`#t5 tbody tr.row${i} td#n4`).textContent;
            pick.accuracy = document.querySelector(`#t5 tbody tr.row${i} td#n5`).textContent;
            picks.push(pick);
        }
        return picks;
    })
    saveToFile('./file.txt', picks);

    // BETENSURED
    await page.goto('https://www.betensured.com/', {
        waitUntil: 'load',
        // Remove the timeout
        timeout: 0
    });

    const ensuredPicks = await page.evaluate(() => {
        let count = document.querySelectorAll("#today table tr").length;
        const picks = []
        for (let i = 0; i < count; i++) {
            let pick = {}
            if (document.querySelectorAll("#today table tr")[i].children[0].textContent != '') {
                pick.league = document.querySelectorAll("#today table tr")[i].children[0].textContent
                pick.fixture = document.querySelectorAll("#today table tr")[i].children[1].textContent
                pick.tip = document.querySelectorAll("#today table tr")[i].children[2].children[0].textContent
                pick.odd = document.querySelectorAll("#today table tr")[i].children[2].children[1].textContent
                picks.push(pick)
            }
        }


        return picks;
    });

    saveToFile('./betensured.txt', ensuredPicks)
    // console.log(ensuredPicks)

    // BETSHOOT
    await page.goto('https://www.betshoot.com/football/accumulator-tips/', {
        waitUntil: 'load',
        // Remove the timeout
        timeout: 0
    });

    const betShootPicks = await page.evaluate(() => {
        let count = document.querySelector(".ok").children.length - 1;
        picks = []

        for (let i = 0; i < count; i++) {
            let pick = {};
            let matchDetailsArr = document.querySelector(".ok").children[i].children[0].innerText.trim().split('\n');
            let tip = matchDetailsArr[1];
            pick.fixture = matchDetailsArr[0];
            pick.tip = tip;
            pick.odd = document.querySelector(".ok > .mth .dbb").textContent;
            pick.date = document.querySelector('.date').innerText.split('\n')[0]

            picks.push(pick);
        }
        debugger
        return picks;
    });
    saveToFile('./betshoot.txt', betShootPicks);
    // console.log(betShootPicks);

    // STATS24
    await page.goto('https://www.stats24.com/football', {
        waitUntil: 'load',
        // Remove the timeout
        timeout: 0
    });

    const stats24Picks = await page.evaluate(() => {
        let count = document.querySelectorAll('.top_ten_match_content table .table_td.pattern1').length;
        let picks = [];

        for (let i = 0; i < count; i++) {
            let pick = {}
            pick.time = document.querySelectorAll('.top_ten_match_content table .table_td.pattern1')[i].children[0].textContent.trim();
            let league = document.querySelectorAll('.top_ten_match_content table .table_td.pattern1')[i].children[1].innerText.trim().split('\n');
            pick.league = league.join(' ');
            let teams = document.querySelectorAll('.top_ten_match_content table .table_td.pattern1')[i].children[2].innerText.trim().split('\n')
            pick.fixture = teams.join(' ')
            pick.tip = document.querySelectorAll('.top_ten_match_content table .table_td.pattern1')[i].children[4].innerText.trim();
            pick.odd = document.querySelectorAll('.top_ten_match_content table .table_td.pattern1')[i].children[5].innerText.trim();
            pick.accuracy = document.querySelectorAll('.top_ten_match_content table .table_td.pattern1')[0].children[3].innerText.trim()

            picks.push(pick)
        }
        return picks;
    })
    saveToFile('./stats24.txt', stats24Picks);
    // console.log(stats24Picks);


    // ABRAHAMTIPS
    await page.goto('https://www.abrahamtips.com/', {
        waitUntil: 'load',
        // Remove the timeout
        timeout: 0
    });

    const abrahamTips = await page.evaluate(() => {
        let count = document.querySelectorAll('.entry-content tr').length;
        let picks = []

        for (let i = 1; i < count; i++) {
            let pick = {}

            pick.time = document.querySelectorAll('.entry-content tr')[i].children[0].innerText;
            pick.fixture = document.querySelectorAll('.entry-content tr')[i].children[1].innerText;
            pick.tip = document.querySelectorAll('.entry-content tr')[i].children[2].innerText;
            pick.odd = document.querySelectorAll('.entry-content tr')[i].children[3].innerText;

            picks.push(pick);
        }
        return picks;
    })
    saveToFile('./abrahamtips.txt', abrahamTips);
    // console.log(abrahamTips);


    // AFOOTBALLREPORT
    await page.goto('https://afootballreport.com/predictions/1X2-football-tips', {
        waitUntil: 'load',
        // Remove the timeout
        timeout: 0
    });

    const aFootballReportPicks = await page.evaluate(() => {
        let count = document.querySelector('.predictions-table tbody').children.length;
        let picks = []

        for (let i = 0; i < count; i++) {
            let pick = {}

            if (document.querySelector('.predictions-table tbody').children[i].children.length > 2) {
                let kickOffArr = document.querySelector('.predictions-table tbody').children[i].children[0].innerText.split('\n')
                pick.time = kickOffArr[1]
                pick.date = kickOffArr[0]

                let teams = document.querySelector('.predictions-table tbody').children[i].children[1].innerText.split('\n')
                pick.league = teams.shift();
                pick.fixture = teams.join(' vs ');
                pick.tip = document.querySelector('.predictions-table tbody').children[i].children[2].innerText
                pick.odd = ''

                picks.push(pick);
            }
        }
        return picks;
    })
    saveToFile('./afootballreport.txt', aFootballReportPicks);
    // console.log(aFootballReportPicks);

    // BETNUMBERS
    await page.goto('https://betnumbers.gr/free-betting-tips', {
        waitUntil: 'load',
        // Remove the timeout
        timeout: 0
    });

    const betNumbers = await page.evaluate(() => {
        let count = document.querySelectorAll('.item-featured table tbody')[1].children.length;
        let picks = []
        let date = document.querySelectorAll('.item-featured table tbody')[1].children[0].children[0].textContent;

        for (let i = 1; i < count; i++) {
            let pick = {}

            let leagueAndTime = document.querySelectorAll('.item-featured table tbody')[1].children[i].children[1].textContent.split(' ')

            pick.league = leagueAndTime[0];
            pick.time = leagueAndTime[1]
            pick.date = date;

            pick.fixture = document.querySelectorAll('.item-featured table tbody')[1].children[i].children[2].textContent.trim()

            let tipAndOdd = document.querySelectorAll('.item-featured table tbody')[1].children[i].children[3].textContent.trim().split(' ')

            pick.tip = tipAndOdd[0]
            pick.odd = tipAndOdd[1]

            picks.push(pick);
        }
        return picks;
    })
    saveToFile('./betnumbers.txt', betNumbers);
    console.log(betNumbers);


    await browser.close();
})();