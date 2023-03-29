import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { heroCreated } from '../heroesList/heroesSlice';
import { useHttp } from '../../hooks/http.hook';


const HeroesAddForm = () => {

    const [heroName, setHeroName] = useState('');
    const [heroDescription, setHeroDescription] = useState('');
    const [heroElement, setHeroElement] = useState('');

    const {filters, filtersLoadingStatus} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const {request} = useHttp();

    const renderFiltersList = (arr) => {
        if (filtersLoadingStatus === "loading") {
            return <option>Загрузка элементов</option>
        } else if (filtersLoadingStatus === "error") {
            return <option>Ошибка загрузки</option>
        }

        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Фильтров нет</h5>
        }

        return arr.map(({name, label}) => {
            if (name === 'all')  return null;
            return <option value={name}>{label}</option>
        })
    }

    const addHero = (e) => {
        e.preventDefault();
        const hero={
            id: uuidv4(),
            name: heroName,
            description: heroDescription,
            element: heroElement
        }
        request("http://localhost:3001/heroes", 'POST', JSON.stringify(hero))
        .then(dispatch(heroCreated(hero)))
        .catch(err => console.log(err));

        setHeroName('');
        setHeroDescription('');
        setHeroElement('');
    }

    const elements = renderFiltersList(filters);
    return (
        <form onSubmit={addHero} className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Имя нового героя</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    onChange={(e)=>setHeroName(e.target.value)}
                    value={heroName}
                    />
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Описание</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    value={heroDescription}
                    onChange={(e)=>setHeroDescription(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Выбрать элемент героя</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={heroElement}
                    onChange={(e)=>setHeroElement(e.target.value)}>
                    <option >Я владею элементом...</option>
                    {elements}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Создать</button>
        </form>
    )
}

export default HeroesAddForm;