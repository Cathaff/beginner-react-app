import { useEffect, useState } from 'react';

interface Pokemon {
    name: string;
    order: number;
    types: {
        type: {
            name: string;
        }
    }[];
}


function PokemonApp() {
    const [pokemonName, setPokemonName] = useState("Pikachu")
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null> (null);
    const [submittedName, setSubmittedName] =  useState<string>("");


    const fetchPokemon = async (name: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

            if(!response.ok) {
                throw new Error("Pokemon not found")
            }
            
            const data: Pokemon = await response.json();
            console.log(data)
            setPokemon(data);
        } catch(err) {
            setError((err as Error).message);
            setPokemon(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!submittedName.trim()) return;

        fetchPokemon(submittedName);
    }, [submittedName]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (pokemonName.trim()) {
            setSubmittedName(pokemonName.trim())
        }
    }

    return (
        <div>
            <h1>Pokemon App</h1>
            <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={pokemonName}
                onChange={e => setPokemonName(e.target.value)}
                placeholder="Enter Pokemon Name"
            />
            </form>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {pokemon && (
                <div>
                    <p>Pokemon Name: {pokemon.name}</p>
                    <p>Pokemon Order: {pokemon.order}</p>
                    <p>Pokemon Type:
                        {pokemon.types.map((typeObj, index) => (
                            <span key={index}> {typeObj.type.name}</span>
                        ))}
                    </p>
                </div>
            )}
        </div>
    );
}


export default PokemonApp;