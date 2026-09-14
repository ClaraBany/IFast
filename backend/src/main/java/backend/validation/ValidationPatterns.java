package backend.validation;

public final class ValidationPatterns {

    public static final String PHONE_E164 = "^\\+[1-9]\\d{1,14}$";

    public static final String INSTITUTIONAL_EMAIL = "^[^@\\s]+@([a-zA-Z0-9-]+\\.)?ifnmg\\.edu\\.br$";

    private ValidationPatterns() {
    }
}