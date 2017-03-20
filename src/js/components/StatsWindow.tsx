// External Modules
import * as React from 'react';
import { connect } from 'react-redux';
import LinearProgress from 'material-ui/LinearProgress';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Step, Stepper, StepLabel} from 'material-ui/Stepper';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper'; ;
import Typist from 'react-typist';

// Actions
import {settings} from '../actions/settings';

// Models
import {ItemDetail} from '../models/itemDetail';

function isInt(value: number) {
    return !isNaN(value) && parseInt(Number(value) as any) === value && !isNaN(parseInt(value as any, 10));
}

class StatsWindow extends React.Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.state = {
            ...props
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState({
            ...nextProps
        });
    }

    public render() {
        return (
            <div id='container'>
                {this.renderContent()}
            </div>
        );
    }

    private renderContent() {
        if (this.state.isGettingData) {
            return this.renderProgresses();
        }
        else {
            return this.renderResults();
        }
    }

    private renderResults() {
        let bestPlatValue = 0;
        let bestDucatsValue = 0;
        let overallBestPlatItems: ItemDetail[] = [];
        let overallBestDucatsItems: ItemDetail[] = [];
        this.state.itemDetails.forEach(itemDetail => {
            const itemPlat = itemDetail.stats.recommendedSalePrice.value;
            const itemDucats = itemDetail.stats.ducatsPrice;
            if (itemPlat > bestPlatValue) {
                bestPlatValue = itemPlat;
                overallBestPlatItems = [itemDetail];
            }
            else if (itemPlat === bestPlatValue) {
                overallBestPlatItems.push(itemDetail);
            }

            if (itemDucats > bestDucatsValue) {
                bestDucatsValue = itemDucats;
                overallBestDucatsItems = [itemDetail];
            }
            else if (itemDucats === bestDucatsValue) {
                overallBestDucatsItems.push(itemDetail);
            }
        });
        return <div className='itemDetailsPage'>
                <div className='pageTitle itemDetailsTitle' style={{width: '100%'}}>
                    Found items
                </div>
                <div className='itemDetailsContainer'>
                    {this.state.itemDetails.map((itemDetail, index) => {
                        const salePriceIsRecommended = itemDetail.stats.recommendedSalePrice.reason === 'sell';
                        const isBestValuePlatItem = overallBestPlatItems.indexOf(itemDetail) > -1;
                        const isBestValueDucatsItem = overallBestDucatsItems.indexOf(itemDetail) > -1;
                        return <Card key={index} className='itemDetailsCard'>
                            <div className='itemName'>{itemDetail.name}</div>
                            <div className='itemDetailStatisticValueContainer'>
                                <Divider style={{width: '100%'}} />
                                <div className='currencyImagesWrapper'>
                                    <div className='currencyImageWrapper'>
                                        <Paper className={'currencyPaper' + (isBestValuePlatItem ? ' bestValueActive' : '')} zDepth={1}>
                                            <div className='currencyImageFlexContainer'>
                                                <div className='recommendedPrice'>{itemDetail.stats.recommendedSalePrice.value + ' '}</div>
                                                <img className='currencyImage' src='../img/platinum.png' />
                                            </div>
                                            <div className='bestValueContainer'>
                                                <div className='bestValue'>{isBestValuePlatItem && 'Best value'}</div>                                                
                                            </div>
                                        </Paper>
                                    </div>
                                    <div className='currencyImageWrapper'>
                                        <Paper className={'currencyPaper' + (isBestValueDucatsItem ? ' bestValueActive' : '')} zDepth={1}>
                                            <div className='currencyImageFlexContainer'>
                                                <div className='recommendedPrice'>{itemDetail.stats.ducatsPrice ? itemDetail.stats.ducatsPrice + ' ' : '- '}</div>
                                                <img className='currencyImage' src='../img/ducats.png' />
                                            </div>
                                            <div className='bestValueContainer'>
                                                <div className='bestValue'> {isBestValueDucatsItem && 'Best value'}</div>                                                
                                            </div>
                                        </Paper>
                                    </div>
                                </div>
                                <Divider style={{width: '100%'}} />
                                <div className='mainPriceWrapper'>
                                    <div className='mainPrice'>
                                        <div>
                                            Minimal online selling price
                                        </div>
                                        <div style={!salePriceIsRecommended ? {} : { fontWeight: 700}}>
                                            {itemDetail.stats.minimalOnlineSalePrice || '-'}
                                        </div>
                                    </div>
                                    <div className='mainPrice'>
                                        <div>
                                            Maximal online buying price
                                        </div>
                                        <div style={salePriceIsRecommended ? {} : { fontWeight: 700}}>
                                            {itemDetail.stats.minimalOnlineSalePrice || '-'}
                                        </div>
                                    </div>
                                </div>
                                <div style={{width: '100%'}}>Online Stats</div>
                                <Divider style={{width: '100%'}} />
                                {this.renderCommonStatsDetail(itemDetail.stats.averageOnlineSalePrice, 'Average selling price')}
                                {this.renderCommonStatsDetail(itemDetail.stats.averageOnlineBuyPrice, 'Average buying price')}
                                {this.renderCommonStatsDetail(itemDetail.stats.medianOnlineSalePrice, 'Median selling price')}
                                {this.renderCommonStatsDetail(itemDetail.stats.medianOnlineBuyPrice, 'Median buying price')}
                                {this.renderPriceRange(itemDetail.stats.onlineSalePriceRange, 'Selling price range')}
                                {this.renderPriceRange(itemDetail.stats.onlineBuyPriceRange, 'Buying price range')}
                                <div style={{width: '100%'}}>All Stats</div>
                                <Divider style={{width: '100%'}} />
                                {this.renderCommonStatsDetail(itemDetail.stats.averageBuyPrice, 'Average selling price')}
                                {this.renderCommonStatsDetail(itemDetail.stats.averageBuyPrice, 'Average buying price')}
                                {this.renderCommonStatsDetail(itemDetail.stats.medianSalePrice, 'Median selling price')}
                                {this.renderCommonStatsDetail(itemDetail.stats.medianBuyPrice, 'Median buying price')}
                                {this.renderPriceRange(itemDetail.stats.salePriceRange, 'Selling price range')}
                                {this.renderPriceRange(itemDetail.stats.buyPriceRange, 'Buying price range')}
                            </div>
                        </Card>;
                    })}
                </div>
            </div>;
    }

    private renderCommonStatsDetail(value: number, description: string) {
        const displayValue = value !== null ? (isInt(value) ? value : value.toFixed(2)) : null;
        return (
            <div className='itemDetailStatistic'>
                <div className='itemDetailStatisticDescription'>{description}</div>
                <div className='itemDetailStatisticValue'>{displayValue ? displayValue : '-'}</div>
            </div>
        );
    }

    private renderPriceRange(value: number[], description: string) {
        // TODO Use some chart lib here,
        /*<div>
                {description + ': ' + (value ? value : '-')}
            </div>*/
        return false;
    }

    private renderProgresses(): JSX.Element {
        const isProcessingTesseract = !this.state.isApiWorking;
        return (
            <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
                <div className='pageTitle'>
                    Getting secret orokin data!
                </div>
                <div style={{width: '60%', margin: 'auto'}}>
                    <Stepper activeStep={isProcessingTesseract ? 0 : 1}>
                        <Step>
                            <StepLabel>Read screen data</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Get current item statistics</StepLabel>
                        </Step>
                    </Stepper>
                </div>
                <div>
                    {isProcessingTesseract ? (
                        <LinearProgress key='determinate' mode='determinate' value={this.state.tesseractProgess} />
                    ) : (
                        <LinearProgress key='indeterminate' mode='indeterminate' />
                    )}
                </div>
                {this.state.isStatsWindowVisible &&
                    <div className='orokinConsole'>
                    <div>
                        <Typist cursor={{
                            element: ''
                        }}>
                            {this.generateGibberish()}
                        </Typist>
                    </div>
                </div>}
            </div>
        );
    }

    private generateGibberish() {
            let lines = [];
            const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const maximumLineCharacter = 50;
            const minimumLineCharacter = 25;

            for ( let i = 0; i < 15; i++ ) {
                const lineLength = Math.random() * (maximumLineCharacter - minimumLineCharacter) + minimumLineCharacter;
                let text = '';
                for ( let i = 0; i < lineLength; i++ ) {
                    text += possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
                }
                lines.push(text);
            }
            return (
                <div>
                    {lines.map((line, index) => {
                        return <div key={index} >{line}</div>;
                    })}
                </div>
            );
    }
}

interface Props {
    itemDetails: ItemDetail[];
    tesseractProgess: number;
    isApiWorking: boolean;
    isGettingData: boolean;
    isStatsWindowVisible: boolean;
}

interface State {
    itemDetails: ItemDetail[];
    tesseractProgess: number;
    isApiWorking: boolean;
    isGettingData: boolean;
    isStatsWindowVisible: boolean;
}

export default connect(
    state => {
        return {
            itemDetails: state.itemDetails,
            tesseractProgess: state.tesseractProgess,
            isApiWorking: state.isApiWorking,
            isGettingData: state.isGettingData,
            isStatsWindowVisible: state.isStatsWindowVisible
        };
    }
)(StatsWindow);
