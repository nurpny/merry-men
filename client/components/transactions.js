import React, { Component } from 'react'
import { connect } from 'react-redux'

export const transactions = () => {
  return (
    <div>
      Transactions
    </div>
  )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(transactions)
