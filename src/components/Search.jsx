import React, { useState, useEffect } from 'react'
import { searchMovies } from '../api/tmdb'
import { useActions } from '../api/hooks'
import Poster from './Poster'
import styles from './Search.module.scss'

const Search = () => {
  const [search, setSearch] = useState('')
  const [movies, setMovies] = useState([])
  const [error, setError] = useState()

  const { addMovie } = useActions()

  useEffect(() => {
    /* API */
    const request = async query => {
      // TODO: debounce, cancel
      setError(null)

      try {
        const movies = await searchMovies(query)
        movies.length && setMovies(movies)
      } catch (error) {
        setError(error)
      }
    }

    const query = search.trim()
    query ? request(query) : reset() // 입력이 비면 내용도 비운다.
  }, [search])

  const reset = () => {
    setSearch('')
    setMovies([])
    setError()
  }

  /* actions */
  const submit = e => {
    e.preventDefault()
    addMovie(movies[0])
  }

  /* render */
  const renderItem = ({ id, title, poster_path }, index) => (
    <li className={styles.item} key={id}>
      <button onClick={() => addMovie(movies[index])} className={styles.movie}>
        <Poster w={92} path={poster_path} />
        <h1 className={styles.title}>{title}</h1>
      </button>
    </li>
  )

  return (
    <form onSubmit={submit} className={styles.form}>
      <input
        type="search"
        name="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
        autoComplete="off"
        autoFocus
      />

      {error
        ? error.message
        : !!movies.length && (
            <section className={styles.results}>
              <h1 className={styles.title}>검색 결과</h1>
              <ul className={styles.list}>{movies.map(renderItem)}</ul>
            </section>
          )}

      <button type="submit" disabled={!movies.length} />
    </form>
  )
}

export default Search
