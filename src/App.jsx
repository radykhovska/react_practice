/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';
import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category =
    categoriesFromServer.find(
      categoryItem => categoryItem.id === product.categoryId,
    ) || null;

  const user = category
    ? usersFromServer.find(person => person.id === category.ownerId) || null
    : null;

  return {
    ...product,
    category,
    user,
  };
});

function getFilteredProductsByUser(productsList, query) {
  const productsCopy = [...productsList];

  if (query === 'all') {
    return productsCopy;
  }

  const filteredProducts = productsCopy.filter(product => {
    return product.user.id === query;
  });

  return filteredProducts;
}

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState('all');
  const visibleProducts = getFilteredProductsByUser(products, selectedUserId);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterUser"
                href="#/"
                className={cn({ 'is-active': selectedUserId === 'all' })}
                onClick={() => setSelectedUserId('all')}
                // className={cn({ 'is-active': selectedUser === 'all' })}
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={cn({
                    'is-active': selectedUserId === user.id,
                  })}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value="qwe"
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>
              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
          {visibleProducts.length !== 0 && (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  {['ID', 'Product', 'Category', 'User'].map(item => (
                    <th key={item}>
                      <span className="is-flex is-flex-wrap-nowrap">
                        {item}
                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}Drinks`}</td>

                    <td data-cy="ProductUser" className="has-text-link">
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
