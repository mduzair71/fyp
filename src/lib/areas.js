// KPK Districts and their Areas for MaholAI location system
export const KPK_LOCATIONS = {
  Nowshera: {
    areas: ['Jehangira', 'Nowshera City', 'Pabbi', 'Kheshki', 'Tera', 'Nizampur'],
  },
  Peshawar: {
    areas: ['Hayatabad', 'Saddar', 'University Town', 'Dalazak Road', 'Kohat Road', 'Peshawar Cantonment'],
  },
  Mardan: {
    areas: ['Mardan City', 'Rustam', 'Takht Bhai', 'Katlang', 'Shergarh'],
  },
  Swabi: {
    areas: ['Swabi City', 'Topi', 'Razzar', 'Lahor', 'Yar Hussain'],
  },
  Charsadda: {
    areas: ['Charsadda City', 'Tangi', 'Shabqadar', 'Umarzai', 'Prang Ghar'],
  },
  Abbottabad: {
    areas: ['Abbottabad City', 'Havelian', 'Nawanshehr', 'Mandian', 'Kakul'],
  },
  Haripur: {
    areas: ['Haripur City', 'Ghazi', 'Hattar', 'Khalabat'],
  },
  Mansehra: {
    areas: ['Mansehra City', 'Balakot', 'Shinkiari', 'Oghi'],
  },
  Swat: {
    areas: ['Mingora', 'Saidu Sharif', 'Matta', 'Khwazakhela', 'Bahrain'],
  },
  Kohat: {
    areas: ['Kohat City', 'Lachi', 'Gumbat', 'Hangu', 'Tal'],
  },
};

export const DISTRICTS = Object.keys(KPK_LOCATIONS);

export function getAreas(district) {
  return KPK_LOCATIONS[district]?.areas || [];
}
