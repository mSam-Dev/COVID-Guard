import { Menu } from 'antd';
import logo from '../../Assets/Images/logo.png';
import './Navbar.css';

const { Item } = Menu;

const HealthNav = () => {
    return (
        <div >
            <Menu style ={{backgroundColor: "#0E5F76"}} mode="horizontal" >
                <Item>
                    <img width={200} src={logo} alt="Logo" />
                </Item>
                <Item  >
                    <div className='navbar-menuitem-text'>My Profile</div>
                </Item>
                <Item>
                    <div className='navbar-menuitem-text'>Add Vaccine Clinic</div>
                </Item>
                <Item>
                    <div className='navbar-menuitem-text'>Vaccinate Patient</div>
                </Item>
                <Item>
                    <div className='navbar-menuitem-text'>Positive Patient</div>
                </Item>
                <Item style={{float: 'right', paddingTop: '3px'}}>
                    <div className='navbar-menuitem-text'>Logout</div>
                </Item>
            </Menu>
        </div>
    );
}

export default HealthNav;