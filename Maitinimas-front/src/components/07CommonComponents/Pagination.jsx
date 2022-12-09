import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import _ from "lodash";

import "../../App.css";

const Pagination = (props) => {
  const { itemsCount, pageSize, currentPage, onPageChange } = props;
  const pagesCount = Math.ceil(itemsCount / pageSize);
  const [pages, setPages] = useState([]);
  const [pageToHop, setPageToHop] = useState(1);

  useEffect(() => {
    // if (pagesCount >= 6) {
    //   setPages(_.range(2, 6));
    // } else if (pagesCount < 6) {
    //   setPages(_.range(2, pagesCount));
    // }

    setPages(_.range(2,pagesCount));
    
  }, [pagesCount]);

  if (pagesCount === 1 || pagesCount === 0) return null;

  const handleSubmit = (e) => {
    if (e.key === "Enter" && Number(e.target.value) <= pagesCount) {
      onPageChange(Number(e.target.value));
    } else if (e.key === "Enter" && Number(e.target.value) > pagesCount) {
      setPageToHop(pagesCount);
      onPageChange(pagesCount);
    }
  };

  const onSearchClick = () => {
    if (pageToHop <= pagesCount) {
      onPageChange(pageToHop);
    } else if (pageToHop > pagesCount) {
      setPageToHop(pagesCount);
      onPageChange(pagesCount);
    }
  };

  const handlePrevious = (currentPage) => {
    onPageChange(currentPage - 1);
  };

  const handleNext = (currentPage) => {
    if (currentPage === pagesCount) {
      currentPage = pagesCount - 1;
    }

    onPageChange(currentPage + 1);
  };

  if (pagesCount > 6) {
    return (
      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            {/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/}
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => handlePrevious(currentPage)}
                disabled={currentPage === 1 ? true : false}
              >
                &lt;
              </button>
            </li>
            {/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/}

            {/* VIENETAS */}

            <li
              className={1 === currentPage ? "page-item active" : "page-item"}
            >
              <button className="page-link" onClick={() => onPageChange(1)}>
                1
              </button>
            </li>
            {/* VIENETAS */}
 
  
            {/* TARPAS 1*/}
      
            {currentPage > 6   ? (
              <li className="page-item">
                <button className="page-link nohoverbtn" disabled>
                  &lt;...&gt;
                </button>
              </li>
            ) : (
              <></>
            )}
  
       

            {/* TARPAS1 */}

            {/* BODIS */}
            {pages.filter(page => (page - currentPage < 5) && (page - currentPage > -5) ).map((page) => (
              <li
                key={page}
                className={
                  page === currentPage ? "page-item active" : "page-item"
                }
              >
                <button
                  onClick={() => onPageChange(page)}
                  className="page-link"
                >
                  {page}
                </button>
              </li>
            ))}
            {/* BODIS  */}
 
        
            {/* TARPAS 2*/}
      
            {currentPage < pagesCount - 6  ? (
              <li className="page-item">
                <button className="page-link nohoverbtn" disabled>
                  &lt;...&gt;
                </button>
              </li>
            ) : (
              <></>
            )}
            
            {/* TARPAS2 */}

 
            {/* PASKUTINIS */}
            <li
              className={
                Number(pagesCount) === currentPage
                  ? "page-item active"
                  : "page-item"
              }
            >
              <button
                className="page-link"
                onClick={() => onPageChange(pagesCount)}
              >
                {pagesCount}
              </button>
            </li>
            {/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => handleNext(currentPage)}
                disabled={currentPage === pagesCount ? true : false}
              >
                &gt;
              </button>
            </li>

            <li className="page-item">
              <div className="row">
                <div className="col"></div>
                <div className="col">
                  <input
                    className="page-link paginationPageInputBox"
                    placeholder="#"
                    maxLength={3}
                    value={isNaN(pageToHop) ? setPageToHop(1) : pageToHop}
                    onChange={(e) => setPageToHop(Number(e.target.value))}
                    onKeyPress={(e) => handleSubmit(e)}
                  />
                </div>
              </div>
            </li>
            <li>
              <div className="col page-link" onClick={() => onSearchClick()}>
                <FontAwesomeIcon icon={faSearch} />
              </div>
            </li>

            {/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}
          </ul>
        </nav>
      </div>
    );
  } else {
    return (
      <div className="d-flex justify-content-center">
        <nav>
          <ul className="pagination">
            {/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/}

            <li className={"page-item"}>
              <button
                className="page-link"
                onClick={() => handlePrevious(currentPage)}
                disabled={currentPage === 1 ? true : false}
              >
                &lt;
              </button>
            </li>
            {/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/}

            {/* VIENETAS */}
            <li
              className={1 === currentPage ? "page-item active" : "page-item"}
            >
              <button className="page-link" onClick={() => onPageChange(1)}>
                1
              </button>
            </li>
            {/* VIENETAS */}

            {/* BODIS */}
            {pages.map((page) => (
              <li
                key={page}
                className={
                  page === currentPage ? "page-item active" : "page-item"
                }
              >
                <button
                  onClick={() => onPageChange(page)}
                  className="page-link"
                >
                  {page}
                </button>
              </li>
            ))}
            {/* BODIS */}

            {/* PASKUTINIS */}
            <li
              className={
                Number(pagesCount) === currentPage
                  ? "page-item active"
                  : "page-item"
              }
            >
              <button
                className="page-link"
                onClick={() => onPageChange(pagesCount)}
              >
                {pagesCount}
              </button>
            </li>
            {/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === pagesCount ? true : false}
              >
                &gt;
              </button>
            </li>
            {/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/}
          </ul>
        </nav>
      </div>
    );
  }
};

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
