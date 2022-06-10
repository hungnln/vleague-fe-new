import { useEffect, useState } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation, Link as RouterLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';

// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import SearchNotFound from '../../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { StaffMoreMenu, StaffListHead, StaffListToolbar } from 'src/components/_dashboard/staff/list';
import { getContractList, getStaffContracts, getStaffDetail, removeContract, removeStaff } from 'src/redux/slices/staff';
import StaffNewForm from 'src/components/_dashboard/staff/StaffNewForm';
import _, { filter } from 'lodash';
import moment from 'moment';
import { fCurrency } from 'src/utils/formatNumber';
import StaffContractMoreMenu from 'src/components/_dashboard/staff/contract/StaffContractMoreMenu';
import StaffContractNewForm from 'src/components/_dashboard/staff/StaffContractNewForm';
// ----------------------------------------------------------------------

export default function StaffConTract() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  // const { staffContracts } = useSelector((state) => state.staff);
  const { contractList } = useSelector((state) => state.staff);

  const isEdit = _.isNil(id) ? 0 : 1;
  const { staffDetail } = useSelector((state) => state.staff)
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // const contractList = !_.isNil(staffContracts) ? [staffContracts] : [contractList]
  useEffect(() => {
    if (isEdit) {
      dispatch(getStaffDetail(id))
      dispatch(getContractList(id, 'staff, club'));
    }
    else {
      dispatch(getContractList('', 'staff, club'))
    }

  }, [dispatch]);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = contractList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const TABLE_HEAD = [
    { id: 'staff', label: 'Staff', alignRight: false },
    { id: 'club', label: 'Club', alignRight: false },
    { id: 'salary', label: 'Salary', alignRight: false },
    { id: 'start', label: 'Start', alignRight: false },
    { id: 'end', label: 'End', alignRight: false },
    // { id: 'status', label: 'Status', alignRight: false },
    { id: '', label: 'Action', alignRight: true }
  ];
  const TABLE_HEAD_EDIT = [
    { id: 'club', label: 'Club', alignRight: false },
    { id: 'salary', label: 'Salary', alignRight: false },
    { id: 'start', label: 'Start', alignRight: false },
    { id: 'end', label: 'End', alignRight: false },
    // { id: 'status', label: 'Status', alignRight: false },
    { id: '', label: 'Action', alignRight: true }
  ];
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(array, (_staff) => _staff.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - contractList.length) : 0;

  const filteredStaffs = applySortFilter(contractList, getComparator(order, orderBy), filterName);

  const isStaffNotFound = filteredStaffs.length === 0;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleDeleteStaff = (staffId) => {
    // dispatch(deleteStaff(staffId));
    dispatch(removeStaff(staffId))

  };
  const handleDeleteContract = (staffId) => {
    // dispatch(deleteStaff(staffId));
    dispatch(removeContract(staffId))

  };
  return (
    <Page title="Staff: View contract | V League">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? 'View staff contract' : `View ${staffDetail?.name} contract`}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Staff', href: PATH_DASHBOARD.staff.root },
            { name: !isEdit ? 'View all contracts' : staffDetail?.name, href: `${PATH_DASHBOARD.staff.root}/edit/${staffDetail?.id}` }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={`${PATH_DASHBOARD.staff.contract}/new`}
              startIcon={<Icon icon={plusFill} />}
            >
              New contract
            </Button>
          }
        />
        <Card>
          {/* <StaffListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} /> */}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <StaffListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={isEdit ? TABLE_HEAD_EDIT : TABLE_HEAD}
                  rowCount={contractList.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredStaffs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, staff, club, salary, start, end } = row;
                    const isItemSelected = selected.indexOf(id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        {isEdit ? '' : <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={staff.name} src={staff?.imageURL} />
                            <Typography variant="subtitle2" noWrap>
                              {staff?.name}
                            </Typography>
                          </Stack>
                        </TableCell>}
                        {/* <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                        </TableCell> */}
                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar alt={club} src={club?.imageURL} />
                            <Typography variant="subtitle2" noWrap>
                              {club?.name}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{fCurrency(salary)}</TableCell>
                        <TableCell align="left">{moment(start).format('DD-MM-YYYY')}</TableCell>
                        <TableCell align="left">{moment(end).format('DD-MM-YYYY')}</TableCell>

                        {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}
                        {/* <TableCell align="left">
                          <Label
                            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                            color={(status === 'banned' && 'error') || 'success'}
                          >
                            {sentenceCase(status)}
                          </Label>
                        </TableCell> */}

                        <TableCell align="right">
                          <StaffContractMoreMenu onDelete={() => handleDeleteContract(id)} contractId={id} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isStaffNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={contractList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        {/* <StaffContractNewForm isEdit={isEdit} currentContract={currentContract} /> */}
        {/* <StaffNewForm isEdit={isEdit} staffDetail={staffDetail} /> */}

      </Container>
    </Page>
  );
}
