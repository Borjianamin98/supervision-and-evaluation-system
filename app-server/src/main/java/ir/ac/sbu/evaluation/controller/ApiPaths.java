package ir.ac.sbu.evaluation.controller;

public class ApiPaths {

    public final static String API_ROOT_PATH = "/api/v1";
    public final static String API_AUTHENTICATION_ROOT_PATH = API_ROOT_PATH + "/auth";

    public final static String API_PROBLEM_ROOT_PATH = API_ROOT_PATH + "/problem";
    public final static String API_PROBLEM_STUDENT_ROOT_PATH = API_PROBLEM_ROOT_PATH + "/authenticatedStudent";
    public final static String API_PROBLEM_MASTER_ROOT_PATH = API_PROBLEM_ROOT_PATH + "/authenticatedMaster";

    public final static String API_UNIVERSITY_ROOT_PATH = API_ROOT_PATH + "/university";
    public final static String API_FACULTY_ROOT_PATH = API_ROOT_PATH + "/faculty";

    public final static String API_SCHEDULE_ROOT_PATH = API_ROOT_PATH + "/schedule";
    public final static String API_REVIEW_ROOT_PATH = API_ROOT_PATH + "/review";

    // User Paths
    public final static String API_USER_ROOT_PATH = API_ROOT_PATH + "/user";
    public final static String API_ADMIN_ROOT_PATH = API_ROOT_PATH + "/admin";
    public final static String API_MASTER_ROOT_PATH = API_ROOT_PATH + "/master";
    public final static String API_STUDENT_ROOT_PATH = API_ROOT_PATH + "/student";

    public final static String API_NOTIFICATION_ROOT_PATH = API_ROOT_PATH + "/notification";

    private ApiPaths() {
    }

}
