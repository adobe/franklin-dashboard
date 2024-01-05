import {
  TableView, TableHeader, TableBody, Row, Cell, Column,

  Badge, Text, ProgressBar, ContextualHelp, Content, Heading, IllustratedMessage, Divider, Button,
} from '@adobe/react-spectrum';
import './RumTableView.css';
import CheckmarkCircle from '@spectrum-icons/workflow/CheckmarkCircle';
import AlertCircle from '@spectrum-icons/workflow/AlertCircle';
import CloseCircle from '@spectrum-icons/workflow/CloseCircle';
import SentimentNeutral from '@spectrum-icons/workflow/SentimentNeutral';
import AlertTriangle from '@spectrum-icons/workflow/Alert';
import NotFound from '@spectrum-icons/illustrations/NotFound';
import { useNavigate } from 'react-router-dom';
import { useStore } from 'stores/global';

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
    let navigate = useNavigate();
    const { setReportUrl, setStartDate, setEndDate, setGlobalUrl, setReportGenerated } = useStore();
    return (
      data.length > 0
            && <TableView width="100%" height="100%" alignSelf="end" overflowMode='truncate' selectionMode='multiple' selectionStyle='highlight' density='compact' id='tableview'>
                <TableHeader>
                    {(
                        columns.map((key) => {
                          if (key === 'url') {
                            const hostname = data[0][key] ? new URL(data[0][key].startsWith('https://') ? data[0][key] : `https://${data[0][key]}`).hostname : '';
                            return <Column align="start" width="fit-content" allowsResizing={true}>{`${key} (${hostname})`}</Column>;
                          }
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
                                        const currCol = col === 'avglcp' && rum[col] ? rum[col] / 1000 : rum[col];
                                        const numb = parseFloat(currCol).toFixed(2).toLocaleString('en-US');
                                        const displayedNumb = numb.endsWith('.00') ? numb.replace('.00', '') : numb;
                                        if (displayedNumb && displayedNumb <= ranges[col][0]) {
                                          return <Cell width='size-1000'>
                                                            <Badge width="size-1000" variant="positive">
                                                                <CheckmarkCircle aria-label="Pass" />
                                                                <Text>{displayedNumb}</Text>
                                                            </Badge>
                                                        </Cell>;
                                        } if (
                                          displayedNumb > ranges[col][0] && displayedNumb < ranges[col][1]
                                        ) {
                                          return <Cell width='size-1000'>
                                                            <Badge width="size-1000" alignSelf='center' variant='yellow'>
                                                                <AlertTriangle aria-label="Okay" />
                                                                <Text>{displayedNumb}</Text>
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
                                                                <Text>{displayedNumb}</Text>
                                                            </Badge>
                                                        </Cell>;
                                      } if (col === 'pageviews') {
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
