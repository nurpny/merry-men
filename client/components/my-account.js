import React, { Component } from 'react'
import { connect } from 'react-redux'

export const MyAccount = () => {
  return (
    <div>
      account page
    </div>
  )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps) (MyAccount)
