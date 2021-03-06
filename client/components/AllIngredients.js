import React from "react";
import { connect } from "react-redux";
import {withRouter} from 'react-router-dom';


import {
  getAllIngredientsThunk,
  addIngredientThunk,
} from "../redux/ingredients";

class AllIngredients extends React.Component {
  componentDidMount() {
    const userName = this.props.match.params.userName
    this.props.addIngredient(userName, this.props.ingred)
    this.props.getIngredients(userName);

  }
  render() {
    const ingredients = this.props.ingredients;
    {console.log(this.props)}
    return (
      <div>

      </div>
    );
}

}

const mapState = (state) => {
  return {
    ingredients: state.ingredients,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getIngredients: userName => dispatch(getAllIngredientsThunk(userName)),
    addIngredient: (userName, ingredient) =>
      dispatch(addIngredientThunk(userName, ingredient)),
  };
};

export default withRouter(connect(mapState, mapDispatch)(AllIngredients));
