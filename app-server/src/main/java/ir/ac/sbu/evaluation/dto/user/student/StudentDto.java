package ir.ac.sbu.evaluation.dto.user.student;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
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

    public StudentDto() {
    }

    @Builder
    public StudentDto(long id, String firstName, String lastName, String username, String password,
            PersonalInfoDto personalInfo, String studentNumber) {
        super(id, firstName, lastName, username, password, personalInfo);
        this.studentNumber = studentNumber;
    }

    public static StudentDto from(Student student) {
        return builder()
                .id(student.getId())
                .username(student.getUsername()).password(student.getPassword())
                .firstName(student.getFirstName()).lastName(student.getLastName())
                .personalInfo(
                        student.getPersonalInfo() != null ? PersonalInfoDto.from(student.getPersonalInfo()) : null)
                .studentNumber(student.getStudentNumber())
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
}
