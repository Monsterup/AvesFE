import React, {forwardRef, useState,useImperativeHandle} from "react";
import {Pagination, PaginationItem, PaginationLink} from "reactstrap";

const Paginate = forwardRef((props, ref) => {
    const [maxPage, setMaxPage] = useState(props.maxPage);
    const [paginationActive, setPaginationActive] = useState(props.paginationActive);
    const [pagination, setPagination] = useState(props.pagination);

    const handleChangePagination = (target) => {
        if (maxPage > 5) {
            if (target === 1)
                setPagination([target, target + 1, target + 2, '...', maxPage]);
            else if (target === 2)
                setPagination([target - 1, target, target + 1, '...', maxPage]);
            else if (target === 3)
                setPagination([target - 2, target - 1, target, target + 1, '...', maxPage]);
            else if (maxPage - target === 2)
                setPagination([1, '...', maxPage - 3, maxPage - 2, maxPage - 1, maxPage]);
            else if (maxPage - target < 3)
                setPagination([1, '...', maxPage - 2, maxPage - 1, maxPage]);
            else
                setPagination([1, '...', target - 1, target, target + 1, '...', maxPage]);
        } else {
            setPagination(Array.from(Array(maxPage).keys()).map(x => ++x));
        }
        setPaginationActive(target);
        props.onChange(target);
    }

    const handleSearch = (pagination,maxPage) => {
        setPagination(pagination);
        setPaginationActive(1);
        setMaxPage(maxPage)
    }

    useImperativeHandle(ref, () => {
        return {
            handleSearch: handleSearch
        }
    });

    return (
        <Pagination>
            <PaginationItem onClick={() => {
                if (paginationActive > 1) handleChangePagination(paginationActive - 1)
            }}>
                <PaginationLink previous tag="button"></PaginationLink>
            </PaginationItem>
            {
                pagination.map((data, key) => {
                    return (
                        <PaginationItem onClick={() => {
                            if (data !== '...') handleChangePagination(data)
                        }} key={key} active={data === paginationActive}>
                            <PaginationLink tag="button">{data}</PaginationLink>
                        </PaginationItem>
                    )
                })
            }
            <PaginationItem onClick={() => {
                if (paginationActive < maxPage) handleChangePagination(paginationActive + 1)
            }}>
                <PaginationLink next tag="button"></PaginationLink>
            </PaginationItem>
        </Pagination>
    )
})

export default Paginate;