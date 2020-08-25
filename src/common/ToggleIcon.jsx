import React from 'react'
import Menu from '@material-ui/icons/Menu';
import Close from '@material-ui/icons/Close';

export default function ToggleIcon({isOpen}) {
  const styles = {fontSize: '30px', color: '#263a52'}
  return isOpen ? <Close style={styles}/> : <Menu style={styles}/>;
}
