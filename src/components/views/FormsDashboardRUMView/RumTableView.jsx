import {
  TableView, TableHeader, TableBody, Row, Cell, Column, StatusLight,

  Badge, Text, ProgressBar, ContextualHelp, Content, Heading, IllustratedMessage, Divider, Button,
} from '@adobe/react-spectrum';
import './RumTableView.css';
import CheckmarkCircle from '@spectrum-icons/workflow/CheckmarkCircle';
import AlertCircle from '@spectrum-icons/workflow/AlertCircle';
import CloseCircle from '@spectrum-icons/workflow/CloseCircle';
import SentimentNeutral from '@spectrum-icons/workflow/SentimentNeutral';
import AlertTriangle from '@spectrum-icons/workflow/Alert';
import NotFound from '@spectrum-icons/illustrations/NotFound';
import {queryRequest } from '../../../connectors/utils';

export function RumTableView({
  data, dataFlag, columns, columnHeadings, config, configSetter, setter
}) {
  if (data.length > 0) {
    const ranges = {
      avglcp: [2.5, 4.00],
      avgfid: [100, 300],
      avginp: [200, 500],
      avgcls: [0.1, 0.25],
    };
    const metrics = {
      avglcp: 's',
      avginp: 'ms',
      avgcls: '',
    }
    return (
      data.length > 0 &&  <TableView width="100%" height="100%" alignSelf="end" overflowMode='truncate' selectionMode='multiple' selectionStyle='highlight' density='compact' id='tableview'>
                <TableHeader>
                    {(
                        columns.map((key) => {
                          if (key === 'url') {
                            const hostname = data[0][key] ? new URL(data[0][key].startsWith('https://') ? data[0][key] : `https://${data[0][key]}`).hostname : '';
                            return <Column align="start" width="fit-content" allowsResizing={true}>{`${key} (${hostname})`}</Column>;
                          }
                          if(key !== 'views' && key !== 'formsubmission') {
                            return (
                                <Column align="center">
                                    <ContextualHelp variant="info">
                                        <Heading>{columnHeadings[key][0]}</Heading>
                                        <Divider size='M'></Divider>
                                        <Content>
                                            <StatusLight variant='positive'>{` Good if <= ${ranges[key][0]}${metrics[key]}`}</StatusLight>
                                            <StatusLight variant='yellow'>{` Okay if > ${ranges[key][0]}${metrics[key]} and <= ${ranges[key][1]}${metrics[key]}`}</StatusLight>
                                            <StatusLight variant='negative'>{` Bad if > ${ranges[key][1]}${metrics[key]}`}</StatusLight>
                                            <Text>{columnHeadings[key][1]}</Text>
                                        </Content>
                                    </ContextualHelp>
                                    <Text>{columnHeadings[key][0]}</Text>
                                </Column>
                          );
                        } else{
                          return (
                            <Column align="center">
                                <ContextualHelp variant="info">
                                    <Heading>{columnHeadings[key][0]}</Heading>
                                    <Divider size='M'></Divider>
                                    <Content>
                                        <Text>{columnHeadings[key][1]}</Text>
                                    </Content>
                                </ContextualHelp>
                                <Text>{columnHeadings[key][0]}</Text>
                            </Column>
                      );
                        }
                        })
                    )}
                </TableHeader>
                <TableBody>
                    {
                        data.map((rum) => <Row>
                                {(
                                    columns.map((col) => {
                                      if (col === 'url') {
                                        if(rum[col] === 'Other'){
                                          return <Cell>{rum[col]}</Cell>;
                                        }
                                        return <Cell><a href={rum[col]} target="_blank">{rum[col].replace(/^https?:\/\/[^/]+/i, '')}</a></Cell>;
                                      } if (col.startsWith('avg')) {
                                        console.log("window");
                                        console.log(window.dashboard);
                                        if(window.dashboard["rum-dashboard"]?.results === undefined){
                                          queryRequest("rum-dashboard", "https://helix-pages.anywhere.run/helix-services/run-query@v3/", 'cwv', `${rum['url']}`);
                                        }
                                      console.log(window);
                                     const cwvData  = window.dashboard["rum-dashboard"].results.data;
                                     let cwvValue = {};
                                     for(let k= 0; k < cwvData.length ; k += 1){
                                       console.log(cwvData[k]['url']);
                                       console.log(data[i]['url']);
                                       if(cwvData[k]['url'] === `${rum['url']}`){
                                        cwvValue = cwvData[k];
                                         break;
                                       }
                                     }
                                     console.log("----cwvValue");
                                     console.log(cwvValue);
                                        const currCol = col === 'avglcp' && cwvValue[col] ? cwvValue[col] / 1000 : cwvValue[col];
                                        const numb = parseFloat(currCol).toFixed(2).toLocaleString('en-US');
                                        const displayedNumb = numb.endsWith('.00') ? numb.replace('.00', '') : numb;
                                        if (displayedNumb && displayedNumb <= ranges[col][0]) {
                                          return <Cell width='size-1000'>
                                                            <Badge width="size-1000" variant="positive">
                                                                <CheckmarkCircle aria-label="Pass" />
                                                                <Text>{displayedNumb + metrics[col]}</Text>
                                                            </Badge>
                                                        </Cell>;
                                        } if (
                                          displayedNumb > ranges[col][0] && displayedNumb < ranges[col][1]
                                        ) {
                                          return <Cell width='size-1000'>
                                                            <Badge width="size-1000" alignSelf='center' variant='yellow'>
                                                                <AlertTriangle aria-label="Okay" />
                                                                <Text>{displayedNumb + metrics[col]}</Text>
                                                            </Badge>
                                                        </Cell>;
                                        } if (numb === 'NaN') {
                                          return <Cell width='size-1000'>
                                                            <Badge width="size-1000" alignSelf='center' variant='neutral'>
                                                                <SentimentNeutral aria-label="N/A" />
                                                                <Text>N/A</Text>
                                                             </Badge>
                                                        </Cell>;
                                        }
                                        return <Cell width='size-1000'>
                                                            <Badge width="size-1000" alignSelf='center' variant='negative'>
                                                                <CloseCircle aria-label="Fail"></CloseCircle>
                                                                <Text>{displayedNumb + metrics[col]}</Text>
                                                            </Badge>
                                                        </Cell>;
                                      } if (col === 'views') {
                                        return <Cell width='size-1500'>
                                                        <Badge width="size-1500" alignSelf='center' variant='info'>
                                                            <Text width="100%">{parseInt(rum[col], 10).toLocaleString('en-US')}</Text>
                                                        </Badge>
                                                    </Cell>;
                                      }
                                      if (col === 'formsubmission') {
                                        return <Cell width='size-1500'>
                                                        <Badge width="size-1500" alignSelf='center' variant='info'>
                                                            <Text width="100%">{parseInt(rum[col], 10).toLocaleString('en-US')}</Text>
                                                        </Badge>
                                                    </Cell>;
                                      }
                                      return <Cell width="size-1000">
                                                    <Badge width="size-1000" alignSelf='center' variant='info'>
                                                        <AlertCircle aria-label="Pass" />
                                                        <Text>{rum[col]}</Text>
                                                    </Badge>
                                                </Cell>;
                                    })
                                )}
                            </Row>
                          )
                    }
                </TableBody>
            </TableView>
    );
  } if (dataFlag) {
    return (
            <ProgressBar margin="auto" label="Loading…" isIndeterminate />
    );
  }
  return (
            <IllustratedMessage margin="auto">
                <NotFound />
                <Heading>No results</Heading>
                <Content>Use Filters</Content>
            </IllustratedMessage>
  );
}
