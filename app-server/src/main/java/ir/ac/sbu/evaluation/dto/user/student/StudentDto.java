package ir.ac.sbu.evaluation.dto.user.student;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import ir.ac.sbu.evaluation.dto.university.UniversityDto;
import ir.ac.sbu.evaluation.dto.university.faculty.FacultyDto;
import ir.ac.sbu.evaluation.dto.user.PersonalInfoDto;
import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.model.user.Student;
import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(Include.NON_NULL)
public class StudentDto extends UserDto {

    private String studentNumber;

    private UniversityDto university;
    private FacultyDto faculty;

    public StudentDto() {
    }

    @Builder
    public StudentDto(long id, String firstName, String lastName, String fullName, String username, String role,
            PersonalInfoDto personalInfo, String studentNumber,
            UniversityDto university, FacultyDto faculty) {
        super(id, firstName, lastName, fullName, username, role, personalInfo);
        this.studentNumber = studentNumber;
        this.university = university;
        this.faculty = faculty;
    }

    public static StudentDto from(Student student) {
        return builder()
                .id(student.getId())
                .username(student.getUsername())
                .firstName(student.getFirstName()).lastName(student.getLastName())
                .fullName(student.getFullName())
                .role(student.getRole())
                .personalInfo(PersonalInfoDto.from(student.getPersonalInfo()))
                .studentNumber(student.getStudentNumber())
                .university(UniversityDto.from(student.getFaculty().getUniversity()))
                .faculty(FacultyDto.from(student.getFaculty()))
                .build();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        if (!super.equals(o)) {
            return false;
        }
        StudentDto that = (StudentDto) o;
        return Objects.equals(studentNumber, that.studentNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), studentNumber);
    }
}
