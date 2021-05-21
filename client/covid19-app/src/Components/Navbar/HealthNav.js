import { Menu } from 'antd';
import logo from '../../Assets/Images/logo.png';
import './Navbar.css';
import { logout } from '../../_helpers/sharedFunctions';
import { useAuth, useAuthUpdate } from '../AuthContext/AuthContext';
import history from '../../_helpers/history';
import PATH from '../../_constants/paths';

const { Item } = Menu;

const HealthNav = () => {
    const updateAuth = useAuthUpdate();
    const auth = useAuth();

    return (
        <div >
            <Menu style ={{backgroundColor: "#0E5F76"}} mode="horizontal" >
                <Item onClick={() => { history.push(PATH.home)}}>
                    <img width={200} src={logo} alt="Logo" />
                </Item>
                <Item  >
                    <div className='navbar-menuitem-text'>My Profile</div>
                </Item>
                <Item>
                    <div className='navbar-menuitem-text'>Add Vaccine Clinic</div>
                </Item>
                <Item onClick={() => { history.push(PATH.confirmUserVaccination) }}>
                    <div className='navbar-menuitem-text'>Vaccinate Patient</div>
                </Item>
                <Item onClick={() => { history.push(PATH.markCovidCase)}}>
                    <div className='navbar-menuitem-text'>Positive Patient</div>
                </Item>
                <Item onClick={() => {logout(updateAuth, auth.token, auth.type)}} style={{float: 'right', paddingTop: '3px'}}>
                    <div className='navbar-menuitem-text'>Logout</div>
                </Item>
            </Menu>
        </div>
    );
}

export default HealthNav;