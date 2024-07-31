import Search from "../components/Search";
import styles from "../page.module.css";
import Link from "next/link";

async function getData(query: string) {
  let res = query? await fetch(`https://restcountries.com/v3.1/translation/${query}`) : await fetch("https://restcountries.com/v3.1/all");
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    //throw new Error("Failed to fetch data");
    res = await fetch("https://restcountries.com/v3.1/all")
  }

  return res.json();
}

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || ''
  const countries = await getData(query)

  return (
    <main className={styles.allCountries}>
      <Search placeholder={"Busque por um país"} />

      <ul className={styles.ul}>
        {countries.map(
          (country: {
            name: { common: string; official: string };
            flags: { png: string; alt: string };
            capital: [];
            translations: { por: { common: string } };
          }) => (
            <li key={country.name.official} className={styles.li}>
              <Link
                href={{
                  pathname: `allCountries/country/`,
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
    </main>
  );
}
