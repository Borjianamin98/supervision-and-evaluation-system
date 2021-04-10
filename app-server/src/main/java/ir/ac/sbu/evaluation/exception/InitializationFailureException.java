package ir.ac.sbu.evaluation.exception;

/**
 * This exception should be used in start of application to kill/stop application (fail-fast policy)
 * if something unexpected happened or unable to initialize a service of application.
 */
public class InitializationFailureException extends Exception {

    public InitializationFailureException() {
        super();
    }

    public InitializationFailureException(String message) {
        super(message);
    }

    public InitializationFailureException(String message, Throwable cause) {
        super(message, cause);
    }
}
