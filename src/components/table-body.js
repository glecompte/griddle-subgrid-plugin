'use strict';

import React from 'react';

class TableBody extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  shouldComponentUpdate(nextProps) {
    return this.props.data !== nextProps.data;
  }


  getRows(rowData) {
    return rowData
      .filter(data => data.visible === undefined || data.visible === true)
      .map((data, index) => {
          return this.getRow(data, index)
        }
      );
  }

  getRow(data, index) {
    let rows = [<this.props.components.Row rowData={data}
      components={this.props.components}
      events={this.props.events}
      rowIndex={index}
      rowProperties={this.props.renderProperties.rowProperties}
      tableProperties={this.props.tableProperties}
      ignoredColumns={this.props.renderProperties.ignoredColumns}
      settings={this.props.settings}
      styles={this.props.styles}
      columnProperties={this.props.renderProperties.columnProperties} />
    ];

    if(data.__metadata && data.__metadata.children && data.__metadata.children.length > 0 && data.__metadata.expanded) {
      let childData = data.__metadata.children
      childData.map(child => {
        delete child.children
        delete child.depth
        delete child.expanded
        delete child.griddleKey
        delete child.parentId
        delete child.hasChildren
        child['__metadata'] = {expanded: false, hasChildren: false, depth: 1}
      })

      let colNames = Object.keys(childData[0])

      let tHead = <thead>
                    <tr>
                      <th style={{padding:10}}></th>
                      {
                        colNames.map((colName, i) => {
                          if (colName !== '__metadata')
                            return <th style={{padding:10}} key={i}>{colName}</th>})
                      }
                    </tr>
                    </thead>

      let childRows = this.getRows(childData)
      let childTable = <tr>
                          <td colSpan={colNames.length}>
                          <table style={{width:'100%'}}>
                            {tHead}
                            <tbody style={{paddingLeft:0}}>
                            {childRows}
                            </tbody>
                          </table>
                          </td>
                       </tr>

      rows.push(childTable);
    }

    return rows;
  }


  render() {
    var rows = this.getRows(this.props.data);

    return (
      <tbody>
        {rows}
      </tbody>
    );
  }
}

//Plugins expect a function
export default Component => TableBody;
