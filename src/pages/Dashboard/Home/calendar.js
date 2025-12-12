import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import esLocale from "@fullcalendar/core/locales/es";
import { connect } from "react-redux";

class EventCalendar extends React.Component {

  constructor(props) {
    super(props);

    const { user } = JSON.parse(this.props.accessToken);
    const roles = user.roles || [];
    const role = roles.length > 0 ? roles[0].name : "guest";

    this.state = {
      role,
    };
  }

  render() {
    const { onCreateEvent, canCreateRoles } = this.props;
    const { role } = this.state;

    const canCreate = canCreateRoles ? canCreateRoles.includes(role) : false;
    return (
      <>
        {onCreateEvent && canCreate && (
          <button
            className="btn btn-primary"
            onClick={onCreateEvent}
            style={{ marginBottom: "10px" }}
          >
            {this.props.createButtonText || "Crear Evento"}
          </button>
        )}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locales={[esLocale]}
          locale="es"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay"
          }}
          events={this.props.events}  // Recibe eventos desde props
          height={this.props.height || 550}  // Altura configurable desde props con valor por defecto
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.RobcodeService.accessToken,
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(EventCalendar);