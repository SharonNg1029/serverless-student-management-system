import { useState } from 'react'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface TableListProps {
  data: any[]
  columns: Column[]
  onSearch?: (term: string) => void
  onFilter?: (filters: any) => void
  onPageChange?: (page: number) => void
  currentPage?: number
  totalPages?: number
  loading?: boolean
}

export default function TableList({
  data,
  columns,
  onSearch,
  onFilter,
  onPageChange,
  currentPage = 1,
  totalPages = 1,
  loading = false
}: TableListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onSearch?.(value)
  }

  return (
    <div className="table-list-component">
      {onSearch && (
        <div className="table-search">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>
      )}

      {loading ? (
        <div className="table-loading">Đang tải...</div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, index) => (
                  <tr key={index}>
                    {columns.map((column) => (
                      <td key={column.key}>
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            
            {data.length === 0 && (
              <div className="no-data">Không có dữ liệu</div>
            )}
          </div>

          {totalPages > 1 && onPageChange && (
            <div className="table-pagination">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-page"
              >
                Trước
              </button>
              <span className="page-info">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-page"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
