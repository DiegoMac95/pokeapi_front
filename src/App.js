import logo from './logo.svg'
import './App.css'
import { useState, useEffect } from 'react'

function App() {
  const [pokemons, setPokemons] = useState([])
  const [partyPokemons, setParty] = useState([])
  const [searchPokemon, setSearch] = useState({})
  const [search, setText] = useState('')

  const setToParty = async (pokem) => {
    if (pokem.party) {
      const toParty = await fetch('http://localhost:3001/unset_favorite', {
        method: 'PATCH',
        body: JSON.stringify({
          id: pokem._id,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      const pPokemon = await toParty.json()
      if (pPokemon) {
        setPokemons([pPokemon.data, ...pokemons])
        const newParty = partyPokemons.filter((item) => {
          if (item.poke_id != pPokemon.data.poke_id) return true
        })
        setParty([...newParty])
      }
    } else {
      if (partyPokemons.length > 5) alert('The party is full')
      else {
        const toParty = await fetch('http://localhost:3001/set_favorite', {
          method: 'PATCH',
          body: JSON.stringify({
            id: pokem._id,
          }),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        })

        const pPokemon = await toParty.json()
        if (pPokemon) {
          setParty([pPokemon.data, ...partyPokemons])
          const newPokes = pokemons.filter((item) => {
            if (item.poke_id != pPokemon.data.poke_id) return true
          })
          setPokemons([...newPokes])
        }
      }
    }
  }

  useEffect(async () => {
    const pokemonProm = await fetch('http://localhost:3001/all_pokemons')
    const pokemons = await pokemonProm.json()

    const partyProm = await fetch('http://localhost:3001/party_pokemons')
    const party = await partyProm.json()

    setPokemons(pokemons.data.pokemons)
    setParty(party.data.pokemons)
  }, [searchPokemon])

  const searchingPokemon = async (e) => {
    try {
      const pokemon = await fetch(
        'https://pokeapi.co/api/v2/pokemon/' + e.target.value + '/'
      )
      const tPokemon = await pokemon.json()
      if (tPokemon) {
        setSearch(tPokemon)
      }
    } catch (ex) {}
  }

  const sendPokemon = async () => {
    if (searchPokemon) {
      const pokemonSave = await fetch('http://localhost:3001/set_pokemon', {
        method: 'POST',
        body: JSON.stringify({
          name: searchPokemon.name,
          poke_id: searchPokemon.id,
          url: searchPokemon.sprites.front_default,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      if (pokemonSave) {
        setText('')

        setSearch({})
      }
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <h1>PokeApi</h1>
        </div>
        <div className="header-div">
          <div>
            <p>List</p>
            {pokemons &&
              pokemons.map((pokem) => (
                <div className="poke" key={pokem.id}>
                  {pokem && <img src={pokem.url} />}
                  <p>{pokem.poke_id + ': ' + pokem.name}</p>
                  <input
                    type="button"
                    value={pokem.party ? 'Remove from party' : 'Add to party'}
                    onClick={() => setToParty(pokem)}
                  />
                </div>
              ))}
            {pokemons.length < 1 && <p>You don't have any pokemon</p>}
          </div>
          <div>
            <p>Catch</p>
            <input
              type="text"
              placeholder="pokemon"
              value={search}
              onChange={(e) => searchingPokemon(e) && setText(e.target.value)}
            />
            <input
              type="button"
              value="catch"
              onClick={sendPokemon}
              disabled={!searchPokemon.id}
            />
            {searchPokemon.id && (
              <div className="poke">
                {searchPokemon.sprites && (
                  <img src={searchPokemon.sprites.front_default} />
                )}
                <p>{`${searchPokemon.id}: ${searchPokemon.name}`}</p>
              </div>
            )}
          </div>

          <div>
            <p>Party</p>
            {partyPokemons.length < 1 && <p>You don't have a party</p>}
            {partyPokemons &&
              partyPokemons.map((pokem) => (
                <div className="poke" key={pokem.id}>
                  {pokem && <img src={pokem.url} />}
                  <p>{pokem.poke_id + ': ' + pokem.name}</p>
                  <input
                    type="button"
                    value={pokem.party ? 'Remove from party' : 'Add to party'}
                    onClick={() => setToParty(pokem)}
                  />
                </div>
              ))}
          </div>
        </div>
      </header>
    </div>
  )
}

export default App
