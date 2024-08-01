import Link from "next/link";
import styles from "../page.module.css"

async function getData(countryName: string) {
  const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
async function getCountryByCode(border: string | null | undefined) {
  const res = await fetch(`https://restcountries.com/v3.1/alpha/${border}`);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function getCountryByLanguage(language: string | null | undefined) {
  const res = await fetch(`https://restcountries.com/v3.1/lang/${language}`);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Page({
  searchParams,
}: {
  searchParams: {
    name: string;
  };
}) {
  const countryList = await getData(searchParams.name);
  const country = countryList[0];
  console.log(country)

  //getting borders
  const borderPromises = country.borders && country.borders.map(async (border: string) => {
    return await getCountryByCode(border);
  });

  const bordersToFlat = borderPromises && await Promise.all(borderPromises);

  const borders = bordersToFlat && bordersToFlat.flat()
  console.log(borders)

  //getting languages
  const extractedLanguages: string[] = Object.values(country.languages);
  console.log(extractedLanguages);

  const languagePromises = extractedLanguages.map(async (border: string) => {
    return await getCountryByLanguage(border);
  });

  const languagesToFlat = await Promise.all(languagePromises);

  const languages = languagesToFlat.flat(Infinity);

  console.log(languages);

  return (
    <div className={styles.countryContent}>
      <div className={styles.countryPage}>
        <div className={styles.countryInfo}>
          <div className={styles.countryTitle}>
            <h2>
              {country.translations.por.common
                ? country.translations.por.common
                : country.name.common}
            </h2>
            <p>{country.name.official}</p>
            <img
              className={styles.flag}
              src={`${country.flags.png}`}
              alt={`${country.flags.alt}`}
            />
          </div>

          <div className={styles.countryMoreInfo}>
            <div className={styles.countryRegion}>
              <h4 className={styles.capital}>
                Capital:{" "}
                {country.capital && country.capital.map((capital: string) => {
                  return <span>{`${capital} `}</span>;
                })}
              </h4>
              <h5>Continente: {country.region}</h5>
              <h6>Região: {country.subregion}</h6>
            </div>

            <div>
              <h4>População: {country.population}</h4>
              {
                <p>
                  Línguas Faladas:{" "}
                  {extractedLanguages.map((value: string, index) => {
                    return <span key={index}>- {value} </span>;
                  })}
                </p>
              }
            </div>
          </div>
        </div>
      </div>
      <div className={styles.countryConnections}>
        {/* fronteira */}
      <div className={styles.countryFrontier}>
        <h1>Países que fazem fronteira</h1>
        <div className={styles.allCountries}>
          <ul className={styles.ul}>
            {borders ? borders.map(
              (
                country: {
                  name: { common: string | undefined; official: string | undefined};
                  flags: { png: string; alt: string };
                  capital: [];
                  translations: { por: { common: string } };
                },
                index: number
              ) => (
                <li key={index} className={styles.li}>
                  <Link className={styles.link}
                    href={{
                      pathname: `country/`,
                      query: {
                        name: country.name.common ? country.name.common: country.name.official,
                      },
                    }}

                  >
                    <h3 >
                      {country.translations.por.common
                        ? country.translations.por.common
                        : country.name.common}
                    </h3>
                    <img
                      className={styles.flag}
                      src={`${country.flags.png}`}
                      alt={`${country.flags.alt}`}
                    />
                  </Link>
                </li>
              )
            ) : <p className={styles.textError}>"Este país não possui nenhuma fronteira terrestre!"</p>}
          </ul>
        </div>
      </div>
      <div>
        {/*Mesma língua*/}
        <div className={styles.countryLanguage}>
          <h1>Países que falam o(s) mesmo(s) idioma(s)</h1>
          <div className={styles.allCountries}>
            <ul className={styles.ul}>
              {languages.map(
                (
                  country: {
                    name: { common: string; official: string };
                    flags: { png: string; alt: string };
                    capital: [];
                    translations: { por: { common: string } };
                  },
                  index
                ) => (
                  <li key={index} className={styles.li}>
                    <Link className={styles.link}
                      href={{
                        pathname: `country/`,
                        query: {
                          name: country.name.common,
                        },
                      }}
                    >
                      <h3>
                        {country.translations.por.common
                          ? country.translations.por.common
                          : country.name.common}
                      </h3>
                      <img
                        className={styles.flag}
                        src={`${country.flags.png}`}
                        alt={`${country.flags.alt}`}
                      />
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
