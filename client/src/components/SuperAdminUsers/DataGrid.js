import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import "./DataGrid.css";
import { Box } from "@mui/system";
import deletelogo from "../../images/Delete.svg";
import axios from "axios";

const DataTable = (props) => {
  const actionColumn = {
    field: "action",
    headerName: "Action",
    width: 200,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => {
      return (
        <div className="action">
          <div className="delete" onClick={() => props.handleDelete(params.row.email)}>
            <img src={deletelogo} alt="" />
          </div>
        </div>
      );
    },
  };

  return (
    <div className="dataTable">
      <Box
        sx={{
          "& .MuiDataGrid-toolbarContainer": {
            backgroundColor: "lightgray",
            borderRadius: "10px",
            height: "60px",

            flexWrap: "nowrap",

            "& .MuiButton-root": {
              color: "blue",
            },
          },
          ".MuiDataGrid-root .MuiDataGrid-cell": {
            borderRight: "1px solid rgba(224, 224, 224,1)",
          },
          ".MuiDataGrid-root .MuiDataGrid-menuIconButton": {
            color: "black",
            backgroundColor: "white",
          },
          ".MuiDataGrid-root .MuiDataGrid-columnHeader": {
            fontWeight: "bold",
            borderRight: "1px solid rgba(224, 224, 224,1)",
          },
          ".MuiDataGrid-root .MuiMenuItem-root": {
            color: "black",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          },
        }}
      >
        <DataGrid
          className="dataGrid centeredHeader"
          rows={props.rows}
          columns={[...props.columns, actionColumn]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              quickFilterProps: { debounceMs: 500 },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          disableColumnFilter
          disableDensitySelector
          disableColumnSelector
          getCellClassName={() => "centeredCell"}
        />
      </Box>
    </div>
  );
};

export default DataTable;
