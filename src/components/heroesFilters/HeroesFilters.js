import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchFilters } from './filtersSlice';
import { changeActiveFilter } from './filtersSlice';
import { useHttp } from '../../hooks/http.hook';

import Spinner from '../spinner/Spinner';

const HeroesFilters = () => {

    const {filters, filtersLoadingStatus, activeFilter} = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchFilters(request));
    
        // eslint-disable-next-line
    }, []);

    if (filtersLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (filtersLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const onChangeActiveFilter = (name) => {
        dispatch(changeActiveFilter(name))
    }

    const renderFiltersList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Фильтров нет</h5>
        }

        return arr.map(({label, className, name}) => {
            if(activeFilter===name) className+=' active'
            return <button onClick={()=>onChangeActiveFilter(name)} className={className}>{label}</button>
        })
    }

    const elements = renderFiltersList(filters);
    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Отфильтруйте героев по элементам</p>
                <div className="btn-group">
                    {elements}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;