'use client'
import  {useSearchParams, usePathname, useRouter}  from "next/navigation"
import styles from '../page.module.css'

export default function Search({placeholder}: {placeholder: string}){
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    function handleSearch(term: string){
        console.log(term)

        const params = new URLSearchParams(searchParams)

        if(term){
            params.set('query', term)
        }else{
            params.delete('query')
        }

        replace(`${pathname}?${params.toString()}`)
    }
    return(
        <div>
            <label htmlFor="search"></label>

            <input type="text"
            className={styles.searchBar}  placeholder={placeholder}
            onChange={(e) => handleSearch(e.target.value)}
            defaultValue={searchParams.get('query')?.toString()}/>


        </div>
    )
}