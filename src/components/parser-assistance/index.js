import { Component, h } from 'preact';
// eslint-disable-next-line no-unused-vars
import React from "preact/compat";
import * as Papa from 'papaparse';
import { forEach, head, slice, pathOr, pipe, map, uniqBy, prop, sortBy, toLower } from 'ramda';
import * as utf8 from 'utf8';

const parseUTF8 = value => utf8.decode(value);
const parseData = dataMatrix => map(row => map(parseUTF8, row), dataMatrix);
const parseLower = dataMatrix => map(row => map(toLower, row), dataMatrix);
const removeDuplicates = records => uniqBy(prop(0), records);
const sortAlpha = records => sortBy(prop(0), records);

export default class ParseAssistance extends Component {
    state = { records: [], recordSelected: {} };
    readFile = () => {
        const fileInput = document.getElementById("csv");
        const updateState = (newRecords) => {
            const records = [
                ...this.state.records,
                newRecords
            ];
            this.setState({ records } );
        };

        forEach(
          file => {
              const reader = new FileReader();
              reader.onload = () => {
                  Papa.parse(reader.result,{
                      complete: (result) => {
                          const { name: fileName } = file;
                          const { data } = result;
                          const fileObject = {
                              fileName,
                              originalLength: data.length,
                              data: {
                                  header: pipe(head, map(parseUTF8))(data),
                                  body: pipe(slice(1, Infinity), parseData, removeDuplicates, sortAlpha, parseLower)(data),
                              }
                          };
                          updateState(fileObject);
                      }
                  });
              };
              reader.readAsBinaryString(file);
          },
          fileInput.files
        );
    };

    selectRecord = ( selectedRecord ) => {
        this.setState({ ...this.state, recordSelected: selectedRecord } );
    };

    render({}, { records, recordSelected }) {
        return (
          <div className={'padding-top-1rem ro-parser'}>
              <div className={'padding-top-0-5rem padding-bottom-1rem'}>
                  <input type="file" id={'csv'} onChange={this.readFile} multiple={true} accept=".csv" />
              </div>
            <div className={'row'}>
                <div className={'col-1-3'}>
                    <table className={'ro-table'}>
                        <thead>
                        <tr>
                            <th>Archivo</th>
                            <th>Count Ori</th>
                            <th>Count Uniq</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            pipe(
                              sortBy(prop('fileName')),
                              map(
                                record => (
                                  <tr onClick={() => this.selectRecord(record)}
                                      className={record.fileName === recordSelected.fileName ? 'selected' : ''}
                                  >
                                      <td>{record.fileName}</td>
                                      <td>{record.originalLength}</td>
                                      <td>{record.data.body.length}</td>
                                  </tr>
                                )
                              ),
                            )(records)
                        }
                        </tbody>
                    </table>
                </div>
                <div className={'col-2-3'}>
                    <table className={'ro-table'}>
                        <thead>
                            <tr>
                                {
                                    pathOr([], ['data', 'header'], recordSelected).map(
                                      thHeader => <th>{thHeader}</th>
                                    )
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                pipe(
                                  pathOr([], ['data', 'body']),
                                  map(
                                    tdBody => <tr>{ map(r => <td>{r}</td>, tdBody) }</tr>
                                  ),
                                )(recordSelected)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        )
      }
}
