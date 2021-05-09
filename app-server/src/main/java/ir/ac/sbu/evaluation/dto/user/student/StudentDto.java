package ir.ac.sbu.evaluation.dto.user.student;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import ir.ac.sbu.evaluation.dto.user.PersonalInfoDto;
import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.model.user.Student;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import lombok.Builder;

@JsonInclude(Include.NON_NULL)
public class StudentDto extends UserDto {

    @NotBlank
    @Pattern(regexp = "[0-9]+")
    private String studentNumber;

    @JsonProperty(access = Access.READ_ONLY)
    private String universityName;

    @JsonProperty(access = Access.READ_ONLY)
    private String facultyName;

    public StudentDto() {
    }

    @Builder
    public StudentDto(long id,
            String firstName, String lastName, String fullName,
            String username, String password, String role,
            PersonalInfoDto personalInfo, String studentNumber, String universityName, String facultyName) {
        super(id, firstName, lastName, fullName, username, password, role, personalInfo);
        this.studentNumber = studentNumber;
        this.universityName = universityName;
        this.facultyName = facultyName;
    }

    public static StudentDto from(Student student) {
        return builder()
                .id(student.getId())
                .username(student.getUsername()).password(student.getPassword())
                .firstName(student.getFirstName()).lastName(student.getLastName())
                .fullName(student.getFirstName() + " " + student.getLastName())
                .role(student.getRole())
                .personalInfo(
                        student.getPersonalInfo() != null ? PersonalInfoDto.from(student.getPersonalInfo()) : null)
                .studentNumber(student.getStudentNumber())
                .universityName(student.getFaculty().getUniversity().getName())
                .facultyName(student.getFaculty().getName())
                .build();
    }

    public Student toStudent() {
        return Student.builder()
                .firstName(getFirstName()).lastName(getLastName())
                .username(getUsername()).password(getPassword())
                .personalInfo(getPersonalInfo() != null ? getPersonalInfo().toPersonalInfo() : null)
                .studentNumber(studentNumber)
                .build();
    }

    public String getStudentNumber() {
        return studentNumber;
    }

    public void setStudentNumber(String studentNumber) {
        this.studentNumber = studentNumber;
    }

    public String getUniversityName() {
        return universityName;
    }

    public void setUniversityName(String universityName) {
        this.universityName = universityName;
    }

    public String getFacultyName() {
        return facultyName;
    }

    public void setFacultyName(String facultyName) {
        this.facultyName = facultyName;
    }
}
