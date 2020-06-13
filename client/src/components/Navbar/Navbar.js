import React, {Component} from 'react';
import classes from './navbar.module.css';
import {Link} from "react-router-dom";
import {connect} from 'react-redux';
import './navbarMobile.css'
import Logo from "../../UI/Logo/Logo";

class StickyNavbar extends Component {
    state = {
        isHovered : false,
        isScrolling: false,
        navBarClasses: [classes.MainBar],
        mobile_navbar_active: false
    };

    componentDidMount(){
        window.addEventListener('scroll', this.handleStickyNavbar);
        window.addEventListener('resize', this.handleMobileNavbarTransition);
        this.handleMobileNavbarTransition();

    }
    componentWillUnmount(){
        window.removeEventListener('scroll', this.handleStickyNavbar);
        window.removeEventListener('resize', this.handleMobileNavbarTransition);

    }

    handleStickyNavbar = () => {
        const page_position = window.pageYOffset;
        let nav = false;
        if(document.getElementById("mainlogo")) {
            nav = document.getElementById("mainlogo").getBoundingClientRect().top + window.scrollY;
        }

        if (page_position==0){
            this.setState({navBarClasses:[classes.MainBar], isScrolling:false});
        }
        else if (!nav || page_position > 80) {
            this.setState({navBarClasses:[classes.MainBar, classes.MainBarSticky], isScrolling:true})
        }

    };

    handleOnHover = () => {
        this.setState({isHovered: true});
    };

    handleOffHover = () => {
        this.setState({isHovered: false});
    };


    handleMobileNavbarTransition = () => {
        if (window.innerWidth < 1100){
            this.setState({mobile_navbar_active:true});
        }
        else{
            this.setState({mobile_navbar_active:false});
        }
    };

    openNav = ( ) => {
        document.getElementById("mySidenav").style.width = "250px";
    };

    closeNav = () => {
        document.getElementById("mySidenav").style.width = "0";
    };

    render() {
        return (
            <React.Fragment>
                {!this.state.mobile_navbar_active ?
                  <div className={this.state.navBarClasses.join(' ') } id="mainnavbar">
                      <nav className={classes.Navbar}  >
                             <div className={classes.NavbarLeft}>
                                 <Logo subtitle={false} logo_size="70" size={"2"}/>
                             </div>
                             <div className={classes.NavbarMiddle}>
                                 <Link onMouseOver={this.handleOffHover}  to="/">Home</Link>
                                 <Link onMouseOver={this.handleOffHover}  to="/sequencer">Sequencer</Link>
                                 <Link onMouseOver={this.handleOffHover}  to="/mybeats">My Beats</Link>
                            </div>
                            <div className={classes.NavbarRight}>
                                <Link to="/"><i className="fa fa-home fa-2x"></i></Link>
                                <Link to="/login"><i className="fa fa-user fa-2x"></i></Link>
                                {this.props.isLoggedIn ?
                                    <Link to="/logout"><i className="fa fa-sign-out fa-2x"></i></Link>
                                    :
                                    null
                                }
                            </div>
                        </nav>
                 </div>
                    :
            <div className={classes.NavbarMobile}>
                <div className={classes.NavbarMobileItems}>
                    <button aria-label="Menu"
                            data-header-nav-toggle=""
                            onClick={this.openNav}>
                                <span className="navigation-toggle-icon">
                                <svg aria-hidden="true"
                            focusable="false"
                            role="presentation"
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="30"
                            viewBox="0 0 18 18">
                                <path fill="currentColor"
                            fill-rule="evenodd"
                            d="M0 0h18v2H0zM0 5h18v2H0zM0 10h18v2H0z"></path>
                        </svg>
                        </span>
                    </button>
                    <Logo subtitle={false} logo_size="0" size={"2"} />
             </div>
                <div id="mySidenav" className="sidenav">
                    <a href="javascript:void(0)" className="closebtn" onClick={this.closeNav}>&times;</a>
                    <Link onClick={this.closeNav} to="/">Home</Link>
                    <Link onClick={this.closeNav} to="/sequencer">Sequencer</Link>
                    <Link onClick={this.closeNav}  to="/mybeats">My Beats</Link>

                    {!this.props.isLoggedIn ?
                        <React.Fragment>
                            <Link onClick={this.closeNav} to="/login">Login</Link>
                            <Link onClick={this.closeNav} to="/signup">Signup</Link>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <Link onClick={this.closeNav} to="/account">Account</Link>
                            <Link onClick={this.closeNav} to="/logout">Logout</Link>
                        </React.Fragment>
                    }
                </div>
            </div>}
        </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.auth.isLoggedIn
    }
};
export default connect(mapStateToProps)(StickyNavbar);