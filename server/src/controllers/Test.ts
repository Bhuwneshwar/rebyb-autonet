import { Request, Response } from "express";

const test = async (req: Request, res: Response) => {
  try {
    res.send("Get Method test working");
  } catch (e) {
    console.log(e);
  }
};

const testPost = async (req: Request, res: Response) => {
  try {
    console.log(req.body);

    let content: string = req.body.info;
    let now: number = req.body.now;

    interface Itrades {
      coin?: string;
      id: number;
      buyTime: string;
      sellTime: string;
      BuyDueTime?: any;
      SellDueTime?: any;
    }

    let responses: {
      success: boolean;
      tradeLength: number;
      trades: Itrades[];
    } = {
      success: false,
      tradeLength: 0,
      trades: [],
    };

    content = content.replace(/ nextLine /g, "\n");
    console.log(content);

    const currencyRegex = /[Oo]perating\s* [Cc]urrency\s*:\s*[A-Z]{2,5}/gi;
    const coinRegex = /[A-Z]{2,5}/g;
    const fullTimeRegex =
      /([Bb]uy|[Ss]ell)\s* [Tt]ime\s*:?\s*:?\s*(\d{1,2}\s*:\s*\d{2}(\s*[APap][Mm])?)/gi;
    const twoDigitRegex = /(\d+)\s*:\s*(\d+)/;
    const peridiumRegex = /[APap][Mm]/;

    const generateDueTime = (oneTime: string) => {
      const twoDigits = oneTime.match(twoDigitRegex);
      if (!twoDigits) return res.send({ error: "Invalid one-time" });
      const hh = twoDigits[1];
      const ss = twoDigits[2];

      const peridium = oneTime.match(peridiumRegex);
      const apm = peridium ? peridium[0].toUpperCase() : "";

      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const dt = `${month} ${day} ${year}`;

      const makedTime = `${hh}:${ss}:00 ${apm} ${dt}`;

      let foundTime = new Date(makedTime);
      let timey =
        foundTime.getHours() +
        ":" +
        foundTime.getMinutes() +
        ":" +
        foundTime.getSeconds();

      const miliDef = foundTime.getTime() - now * 1000;

      if (miliDef > 0) {
        let secondDef = Math.floor(miliDef / 1000) - 65;
        responses.success = true;
        return secondDef;
      }
      responses.success = false;
      return false;
    };

    const currency = content.match(currencyRegex);
    const fullTime: any = content.match(fullTimeRegex);

    if (!currency) return res.send({ error: "Invalid currency" });

    for (let i = 0; i < currency?.length; i++) {
      let coin = currency[i].match(coinRegex)?.[0];

      responses.tradeLength++;
      responses.trades.push({
        coin,
        id: i + 1,
        buyTime: fullTime[2 * i],
        sellTime: fullTime[2 * i + 1],
        BuyDueTime: generateDueTime(fullTime[2 * i]),
        SellDueTime: generateDueTime(fullTime[2 * i + 1]),
      });
    }

    console.log(responses);
    return res.send(responses);
  } catch (e) {
    console.log(e);
    return res.send({ success: false });
  }
};

export { test, testPost };
