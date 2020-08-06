import React from "react";
import { PopAppState, changedFilter, Filters } from '../redux-data/types';
import { connect } from "react-redux";
import {updateFilters} from "../redux-data/actions";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ScrollablePane, ScrollbarVisibility } from 'office-ui-fabric-react/lib/ScrollablePane';
import { Sticky, StickyPositionType } from 'office-ui-fabric-react/lib/Sticky';
import '../scss/FilterBox.css';

interface FilterBoxProps {
  updateFilters: (p: changedFilter) => void;
  currentFilters: Filters;
}


class FilterBox extends React.Component<FilterBoxProps> {

    onChange = (event: { target: any; } ) => {
      this.props.updateFilters({group: event.target.id, filter: event.target.name, value: event.target.checked});
    };
  
    
  
    render() {
      return (
        <div className="filterBox">
          <ScrollablePane scrollbarVisibility={ScrollbarVisibility.always}>
          <Sticky stickyPosition={StickyPositionType.Header}><h3>Filters</h3></Sticky>

          {Object.entries(this.props.currentFilters).map(([groupName, payload]: [string, any]) => {
            return(
              <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1bh-content"
                          id="panel1bh-header"
                          >
                        <Typography>{payload.label}</Typography>
                        </AccordionSummary>
                    <AccordionDetails>
                      <span id="filterGroup">
                      {Object.entries(payload.value).map(([filterObjName, filterPayload]: [string, any]) => {
                        return(
                          <span id="filter"><FormControlLabel
                            aria-label={filterObjName}
                            onClick={(event) => event.stopPropagation()}
                            onFocus={(event) => event.stopPropagation()}
                            control={<Checkbox checked= {filterPayload.value} onChange={this.onChange} id = {groupName} name={filterObjName} />}
                            label={filterPayload.label}
                          /></span>
                      )})}</span>
                  </AccordionDetails>
              </Accordion>

            )})}
            </ScrollablePane>
          </div>
      );
    }
}

function mapStateToProps(state: PopAppState) {
    return { currentFilters: state.currentFilters}
  }
  
  function mapDispatchToProps(dispatch: any) {
    return {
      updateFilters: (p: changedFilter) => dispatch(updateFilters(p))
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(FilterBox);