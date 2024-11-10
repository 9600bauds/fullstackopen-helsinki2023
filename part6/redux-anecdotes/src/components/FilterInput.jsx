import { useDispatch } from "react-redux";
import { setFilter } from "../reducers/filterReducer";

const FilterInput = () => {
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const newFilter = event.target.value;
    dispatch(setFilter(newFilter));
  };
  const style = {
    marginBottom: 10,
  };

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  );
};

export default FilterInput;
