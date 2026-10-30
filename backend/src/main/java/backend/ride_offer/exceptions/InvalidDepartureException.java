package backend.ride_offer.exceptions;

import static backend.shared.constants.RideConstants.MAX_DAYS_AHEAD;

public class InvalidDepartureException extends RuntimeException{
    public InvalidDepartureException() {
        super("A data não pode ultrapassar " + MAX_DAYS_AHEAD + " dias");
    }    
}
