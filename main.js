import axios from "axios";

// Aşağıdaki Fonksiyonu değiştirmeyin.
async function ipAdresimiAl() {
  return await axios({
    method: "get",
    url: "https://apis.code2work.co/ipadresim",
  }).then(function (response) {
    return response.data;
  });
}

const ipAdresim = await ipAdresimiAl();
console.log(ipAdresim);

/*
  AMAÇ:
  - location_card.png dosyasındakine benzer dinamik bir card oluşturmak.
  - HTML ve CSS hazır, önce IP adresini, sonra bunu kullanarak diğer bilgileri alacağız.

	ADIM 1: IP kullanarak verileri almak
  getData fonskiyonunda axios kullanarak şu adrese GET sorgusu atacağız: https://apis.code2work.co/ipgeoapi/{ipAdresiniz}

  Fonksiyon gelen datayı geri dönmeli.

  Not: Request sonucu gelen datayı browserda network tabından inceleyin.
  İpucu: Network tabıından inceleyemezseniz GET isteklerini gönderdiğiniz URL'i direkt browserda açabildiğinizi unutmayın. 😉

  Bu fonksiyonda return ettiğiniz veri, Adım 2'de oluşturacağınız component'de argüman olarak kullanılıyor. Bu yüzden, veride hangi key-value çiftleri olduğunu inceleyin.
*/

async function getData() {
  const ip = await ipAdresimiAl();
  let responseData;
  await axios
    .get(`https://apis.code2work.co/ipgeoapi/${ip}`)
    .then((response) => {
      responseData = response.data;
    });
  console.log(responseData);
  return responseData;
}

/*
	ADIM 2: Alınan veriyi sayfada gösterecek componentı oluşturmak
  getData ile aldığımız konum bazlı veriyi sayfada göstermek için cardOlustur fonskiyonu kullanılacak. DOM metodlarını ve özelliklerini kullanarak aşağıdaki yapıyı oluşturun ve dönün (return edin).

  Not: Ülke Bayrağını bu linkten alabilirsiniz:
  'https://flaglog.com/codes/standardized-rectangle-120px/{ülkeKodu}.png';

	<div class="card">
    <img src={ülke bayrağı url} />
    <div class="card-info">
      <h3 class="ip">{ip adresi}</h3>
      <p class="ulke">{ülke bilgisi (ülke kodu)}</p>
      <p>Enlem: {enlem} Boylam: {boylam}</p>
      <p>Şehir: {şehir}</p>
      <p>Saat dilimi: {saat dilimi}</p>
      <p>Para birimi: {para birimi}</p>
      <p>ISP: {isp}</p>
    </div>
  </div>
*/

function cardOlustur(cardObj) {
  const card = document.createElement("div");
  card.classList.add("card");
  const img = document.createElement("img");
  img.src = `https://flaglog.com/codes/standardized-rectangle-120px/${cardObj.country_code}.png`;
  const cardInfo = document.createElement("div");
  cardInfo.classList.add("card-info");
  const h3 = document.createElement("h3");
  h3.classList.add("ip");
  h3.textContent = cardObj.ip;
  const pUlke = document.createElement("p");
  pUlke.classList.add("ulke");
  pUlke.textContent = `${cardObj.country_name} (${cardObj.country_code})`;
  const pEnlemBoylam = document.createElement("p");
  pEnlemBoylam.textContent = `Enlem: ${cardObj.latitude} Boylam: ${cardObj.longitude}`;
  const pSehir = document.createElement("p");
  pSehir.textContent = `Şehir: ${cardObj.city}`;
  const pSaatDilimi = document.createElement("p");
  pSaatDilimi.textContent = `Saat dilimi: ${cardObj.timezone}`;
  const pParaBirimi = document.createElement("p");
  pParaBirimi.textContent = `Para birimi: ${cardObj.currency}`;
  const pIsp = document.createElement("p");
  pIsp.textContent = `ISP: ${cardObj.isp}`;

  cardInfo.appendChild(h3);
  cardInfo.appendChild(pUlke);
  cardInfo.appendChild(pEnlemBoylam);
  cardInfo.appendChild(pSehir);
  cardInfo.appendChild(pSaatDilimi);
  cardInfo.appendChild(pParaBirimi);
  cardInfo.appendChild(pIsp);

  card.appendChild(img);
  card.appendChild(cardInfo);

  return card;

  /* kodlar buraya */
}

// Buradan sonrasını değiştirmeyin, burası yazdığınız kodu sayfaya uyguluyor.
getData().then((response) => {
  const cardContent = cardOlustur(response);
  const container = document.querySelector(".container");
  container.appendChild(cardContent);
});
